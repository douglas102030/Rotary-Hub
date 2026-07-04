import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/next-auth';
import { getDatebaseClient } from '../../../lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Prevent deleting own account
    if (session.user?.email) {
      const db = getDatebaseClient();
      const userResult = db.execute(
        { sql: 'SELECT email FROM users WHERE id = ?', args: [userId] }
      );

      if (userResult.rows && userResult.rows.length > 0) {
        const userEmail = (userResult.rows[0] as any).email;
        if (userEmail === session.user.email) {
          return res.status(400).json({ error: 'You cannot delete your own account' });
        }
      }
    }

    const db = getDatebaseClient();
    db.execute(
      { sql: 'DELETE FROM users WHERE id = ?', args: [userId] }
    );

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
