import { NextApiRequest, NextApiResponse } from 'next';
import { getDatebaseClient } from '../../lib/database';

type RequestBody = {
  fullName: string;
  email: string;
  clubName: string;
  position: string;
  phoneNumber: string;
  country: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, email, clubName, position, phoneNumber, country, message }: RequestBody = req.body;

    if (!fullName || !email || !clubName || !position || !country || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDatebaseClient();

    // Insert into access_requests table
    const result = db.execute(
      'INSERT INTO access_requests (full_name, email, club_name, position, phone_number, country, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fullName, email, clubName, position, phoneNumber, country, message, 'pending']
    );

    return res.status(201).json({ 
      success: true, 
      message: 'Request submitted successfully. You will hear from us soon!',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving pre-access request:', error);
    return res.status(500).json({ error: 'Failed to submit request' });
  }
}
