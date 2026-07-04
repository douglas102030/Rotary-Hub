import { NextApiRequest, NextApiResponse } from 'next';
import { getDatebaseClient } from '../../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = getDatebaseClient();

    // Get all projects
    const result = await db.execute({
      sql: 'SELECT * FROM projects ORDER BY created_at DESC'
    });

    const projects = result.rows || [];

    return res.status(200).json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      message: 'Error fetching projects',
      error: (error as Error).message
    });
  }
}
