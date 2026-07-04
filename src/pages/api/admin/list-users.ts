import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/next-auth';
import { getDatebaseClient } from '../../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const db = getDatebaseClient();

    const result = db.execute(
      { sql: 'SELECT id, username, full_name, email, club_name, position, role, is_active, created_at FROM users ORDER BY created_at DESC' }
    );

    const users = result.rows || [];

    return res.status(200).json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}
