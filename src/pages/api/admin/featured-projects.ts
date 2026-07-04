import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { db } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { projectIds } = req.body;

    if (!Array.isArray(projectIds) || projectIds.length > 6) {
      return res.status(400).json({ error: 'Invalid project IDs' });
    }

    // Reset is_featured para todos os projetos
    db.execute({
      sql: 'UPDATE projects SET is_featured = 0',
      args: []
    });

    // Marcar selecionados como featured
    for (const projectId of projectIds) {
      db.execute({
        sql: 'UPDATE projects SET is_featured = 1 WHERE id = ?',
        args: [projectId]
      });
    }

    return res.status(200).json({ success: true, message: 'Featured projects updated' });
  } catch (error) {
    console.error('Error updating featured projects:', error);
    return res.status(500).json({ error: 'Failed to update featured projects' });
  }
}
