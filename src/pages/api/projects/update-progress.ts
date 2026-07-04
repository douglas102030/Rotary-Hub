import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { getDatebaseClient } from '../../../lib/database';

interface UpdateProgressResponse {
  success: boolean;
  raised?: number;
  goal?: number;
  percentage?: number;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateProgressResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { projectId, url, platform } = req.body;

  if (!projectId || !url || !platform) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: projectId, url, platform' 
    });
  }

  if (!['gofundme', 'crowdfunder'].includes(platform)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Platform must be gofundme or crowdfunder' 
    });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 15000
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);

    await page.goto(url, { waitUntil: 'networkidle1', timeout: 15000 });

    // Wait briefly for content
    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = await page.evaluate((platformType) => {
      let raised = 0;
      let goal = 0;

      if (platformType === 'gofundme') {
        // GoFundMe selectors
        const amountElements = document.querySelectorAll('[class*="raised"], [class*="amount"], span, div');
        
        for (const el of amountElements) {
          const text = el.textContent || '';
          // Look for patterns like "$1,234" or "£1,234"
          const match = text.match(/[£€$]([\d,]+(?:\.\d{2})?)\s*(?:raised|of|\/)?/);
          if (match && text.length < 50) {
            const amount = parseFloat(match[1].replace(/,/g, ''));
            if (amount > raised) raised = amount;
          }
        }

        // Try to find goal
        const goalMatch = document.body.innerHTML.match(/goal["\']?\s*:\s*["\']?([\d,]+(?:\.\d{2})?)/i);
        if (goalMatch) {
          goal = parseFloat(goalMatch[1].replace(/,/g, ''));
        }
      } else if (platformType === 'crowdfunder') {
        // Crowdfunder selectors
        const raisedElements = document.querySelectorAll(
          '.amount-raised, [data-testid="amount-raised"], .funds-raised, .raised-amount'
        );
        
        for (const el of raisedElements) {
          const text = el.textContent || '';
          const match = text.match(/[£€$]?([\d,]+(?:\.\d{2})?)/);
          if (match) {
            raised = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }

        const goalElements = document.querySelectorAll(
          '.funding-goal, [data-testid="funding-goal"], .target-amount, .goal-amount'
        );
        
        for (const el of goalElements) {
          const text = el.textContent || '';
          const match = text.match(/[£€$]?([\d,]+(?:\.\d{2})?)/);
          if (match) {
            goal = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }
      }

      return { raised, goal };
    }, platform);

    await browser.close();

    // Update database
    const db = getDatebaseClient();
    
    const percentage = data.goal ? (data.raised / data.goal) * 100 : 0;

    await db.execute({
      sql: `UPDATE projects 
            SET raised = ?, goal = ?, last_progress_update = CURRENT_TIMESTAMP 
            WHERE id = ?`,
      args: [data.raised, data.goal, projectId]
    });

    return res.status(200).json({
      success: true,
      raised: data.raised,
      goal: data.goal,
      percentage: Math.round(percentage)
    });
  } catch (error) {
    console.error('Progress update error:', error);
    if (browser) {
      await browser.close();
    }

    // Return last known values from database as fallback
    try {
      const db = getDatebaseClient();
      const result = await db.execute({
        sql: 'SELECT raised, goal FROM projects WHERE id = ?',
        args: [projectId]
      });

      if (result.rows && result.rows.length > 0) {
        const project = result.rows[0] as any;
        return res.status(200).json({
          success: true,
          raised: project.raised || 0,
          goal: project.goal || 0,
          percentage: project.goal ? Math.round((project.raised / project.goal) * 100) : 0
        });
      }
    } catch (dbError) {
      console.error('Fallback fetch error:', dbError);
    }

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update progress'
    });
  }
}
