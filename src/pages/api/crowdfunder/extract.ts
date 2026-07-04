import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

interface ExtractedData {
  title: string;
  description: string;
  images: string[];
  goal?: number;
  raised?: number;
  success: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExtractedData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      title: '',
      description: '',
      images: [],
      message: 'Method not allowed' 
    });
  }

  const { url } = req.body;

  if (!url || !url.includes('crowdfunder.co.uk')) {
    return res.status(400).json({ 
      success: false,
      title: '',
      description: '',
      images: [],
      message: 'Invalid Crowdfunder URL - must be from crowdfunder.co.uk' 
    });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 30000
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for content to load
    await page.waitForSelector('h1, .project-title, [data-testid="project-title"], img', { 
      timeout: 10000 
    }).catch(() => null);

    // Wait for lazy-loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    const extractedData = await page.evaluate(() => {
      // Extract title
      let title = '';
      const titleEl = 
        document.querySelector('h1') ||
        document.querySelector('.project-title') ||
        document.querySelector('[data-testid="project-title"]') ||
        document.querySelector('meta[property="og:title"]');
      
      if (titleEl) {
        title = titleEl.textContent || titleEl.getAttribute('content') || '';
      }

      // Extract description
      let description = '';
      const descriptionSelectors = [
        '.project-description',
        '[data-testid="project-description"]',
        '.story-content',
        '.campaign-description',
        'meta[property="og:description"]'
      ];
      
      for (const selector of descriptionSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          description = el.textContent || el.getAttribute('content') || '';
          break;
        }
      }

      // Extract goal and raised amounts
      let goal = 0;
      let raised = 0;
      
      const goalSelectors = [
        '.funding-goal',
        '[data-testid="funding-goal"]',
        '.target-amount',
        '.goal-amount'
      ];
      
      for (const selector of goalSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.textContent || '';
          const match = text.match(/[£€$]?([\d,]+(?:\.\d{2})?)/);
          if (match) {
            goal = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }
      }

      const raisedSelectors = [
        '.amount-raised',
        '[data-testid="amount-raised"]',
        '.raised-amount',
        '.funds-raised'
      ];
      
      for (const selector of raisedSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.textContent || '';
          const match = text.match(/[£€$]?([\d,]+(?:\.\d{2})?)/);
          if (match) {
            raised = parseFloat(match[1].replace(/,/g, ''));
            break;
          }
        }
      }

      // Extract images
      const images: string[] = [];
      const imgSelectors = [
        'img.project-image',
        'img[data-testid="project-image"]',
        '.carousel img',
        '.gallery img',
        'img[alt*="project"]',
        'img[alt*="campaign"]'
      ];

      const imgElements = document.querySelectorAll('img');
      for (let i = 0; i < Math.min(imgElements.length, 8); i++) {
        const img = imgElements[i];
        const src = img.src || img.getAttribute('data-src');
        if (src && !images.includes(src)) {
          images.push(src);
        }
      }

      return {
        title: title.trim(),
        description: description.trim(),
        images: images.filter(img => img.length > 0),
        goal,
        raised
      };
    });

    await browser.close();

    return res.status(200).json({
      success: true,
      title: extractedData.title,
      description: extractedData.description,
      images: extractedData.images.slice(0, 8), // Limit to 8 images
      goal: extractedData.goal,
      raised: extractedData.raised
    });
  } catch (error) {
    console.error('Crowdfunder extraction error:', error);
    if (browser) {
      await browser.close();
    }

    return res.status(500).json({
      success: false,
      title: '',
      description: '',
      images: [],
      message: error instanceof Error ? error.message : 'Failed to extract Crowdfunder data'
    });
  }
}
