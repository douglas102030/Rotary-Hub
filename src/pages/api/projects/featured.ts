import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Buscar projetos marcados como featured (is_featured = true)
      const result = db.execute({
        sql: 'SELECT id, title, description, main_image FROM projects WHERE is_featured = 1 ORDER BY created_at DESC LIMIT 6',
        args: []
      }) as any;

      const projects = result.rows?.map((row: any) => ({
        id: row[0],
        title: row[1],
        description: row[2],
        main_image: row[3]
      })) || [];

      return res.status(200).json({ projects });
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return res.status(500).json({ error: 'Failed to fetch featured projects' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
