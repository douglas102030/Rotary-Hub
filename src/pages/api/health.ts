import { NextApiRequest, NextApiResponse } from 'next';

// Flag to track if DB was initialized
let dbInitialized = false;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Only initialize once
    if (!dbInitialized) {
      const { initDatebase } = await import('../../lib/database');
      await initDatebase();
      dbInitialized = true;
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Server is running'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
}
