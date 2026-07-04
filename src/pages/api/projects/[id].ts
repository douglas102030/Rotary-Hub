import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const db = await getDatabase();

    // Get project
    const projectResult = await db.execute({
      sql: 'SELECT * FROM projects WHERE id = ?',
      args: [id]
    });

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get project photos
    const photosResult = await db.execute({
      sql: 'SELECT * FROM project_photos WHERE project_id = ?',
      args: [id]
    });

    const photos = photosResult.rows || [];

    return res.status(200).json({
      success: true,
      project: {
        ...project,
        photos: photos
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({
      message: 'Error fetching project',
      error: (error as Error).message
    });
  }
}
