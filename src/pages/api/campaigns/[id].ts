import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../../lib/database';

interface CampaignData {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  percent: number;
  daysLeft?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CampaignData | { error: string }>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Campaign ID required' });
  }

  try {
    const db = getDatabase();
    
    const stmt = db.prepare(`
      SELECT id, title, description, goal, raised, image, createdAt
      FROM campaigns
      WHERE id = ?
    `);

    const campaign = stmt.get(id) as any;

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const percent = Math.round((campaign.raised / campaign.goal) * 100);

    res.status(200).json({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goal: campaign.goal,
      raised: campaign.raised,
      image: campaign.image,
      percent: Math.min(percent, 100)
    });

  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
}
