import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/database';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  projectId?: string;
  createdAt: string;
  embedCode: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, description, goal, image, projectId } = req.body;

  if (!title || !description || !goal) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = getDatabase();
    
    // Criar tabela se não existir
    db.exec(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        goal REAL NOT NULL,
        raised REAL DEFAULT 0,
        image TEXT,
        projectId TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        embedCode TEXT
      )
    `);

    const campaignId = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const embedCode = `<iframe src="${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/embed/campaign/${campaignId}" width="100%" height="400" frameborder="0" style="border-radius: 8px;"></iframe>`;

    const stmt = db.prepare(`
      INSERT INTO campaigns (id, title, description, goal, raised, image, projectId, createdAt, embedCode)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
    `);

    stmt.run(campaignId, title, description, goal, 0, image || '', projectId || '', embedCode);

    res.status(201).json({
      id: campaignId,
      title,
      description,
      goal,
      raised: 0,
      image,
      projectId,
      embedCode
    });

  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
}
