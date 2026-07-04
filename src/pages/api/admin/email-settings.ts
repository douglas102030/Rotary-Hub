import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/next-auth';
import { getDatebaseClient } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only admin can access
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const db = getDatebaseClient();

  if (req.method === 'GET') {
    try {
      // Get current email configuration
      const result = db.execute({
        sql: 'SELECT id, email_address, smtp_host, smtp_port, smtp_user, sender_name, is_active FROM email_config LIMIT 1',
        args: []
      }) as any;

      const config = result.rows && result.rows.length > 0 ? result.rows[0] : null;
      return res.status(200).json({ config });
    } catch (error) {
      console.error('Error fetching email config:', error);
      return res.status(500).json({ error: 'Failed to fetch email configuration' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { emailAddress, smtpHost, smtpPort, smtpUser, smtpPassword, senderName } = req.body;

      // Validate required fields
      if (!emailAddress || !smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if config already exists
      const existingResult = db.execute({
        sql: 'SELECT id FROM email_config LIMIT 1',
        args: []
      }) as any;

      if (existingResult.rows && existingResult.rows.length > 0) {
        // Update existing config
        db.execute({
          sql: `UPDATE email_config SET 
            email_address = ?, 
            smtp_host = ?, 
            smtp_port = ?, 
            smtp_user = ?, 
            smtp_password = ?, 
            sender_name = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = 1`,
          args: [emailAddress, smtpHost, parseInt(smtpPort), smtpUser, smtpPassword, senderName || 'Rotary Club HUB']
        });

        return res.status(200).json({
          success: true,
          message: 'Email configuration updated successfully'
        });
      } else {
        // Insert new config
        db.execute({
          sql: `INSERT INTO email_config 
            (email_address, smtp_host, smtp_port, smtp_user, smtp_password, sender_name, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, 1)`,
          args: [emailAddress, smtpHost, parseInt(smtpPort), smtpUser, smtpPassword, senderName || 'Rotary Club HUB']
        });

        return res.status(201).json({
          success: true,
          message: 'Email configuration saved successfully'
        });
      }
    } catch (error) {
      console.error('Error saving email config:', error);
      return res.status(500).json({ error: 'Failed to save email configuration' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
