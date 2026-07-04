import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/next-auth';
import { getDatebaseClient } from '../../../lib/database';

interface ProjectCreateRequest {
  title: string;
  clubName: string;
  category: string;
  location: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  fundraisingLink: string;
  externalLinks: string;
  contactPerson: string;
  images: Array<{
    id: string;
    src: string;
    name: string;
    isExternal?: boolean;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check authentication using unstable_getServerSession
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      console.error('Session check failed:', { session });
      return res.status(401).json({ message: 'Unauthorized - No session found' });
    }

    console.log('Session found:', { email: session.user.email, id: (session.user as any).id });

    const { title, clubName, category, location, description, status, startDate, endDate, fundraisingLink, externalLinks, contactPerson, images } = req.body as ProjectCreateRequest;

    // Validate required fields
    if (!title || !clubName || !category || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = getDatebaseClient();

    // Get user ID from database (by email)
    const userResult = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [(session.user as any).email]
    });

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = (userResult.rows[0] as any).id;

    // Insert project
    try {
      const insertResult = await db.execute({
        sql: `INSERT INTO projects (title, club_name, category, location, description, status, start_date, end_date, fundraising_link, external_links, contact_person, created_by) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [title, clubName, category, location, description, status, startDate || null, endDate || null, fundraisingLink || null, externalLinks || null, contactPerson || null, userId]
      });

      console.log('Project inserted successfully, result:', insertResult);
    } catch (insertError) {
      console.error('Insert failed:', insertError);
      throw insertError;
    }

    // Get the project ID - try multiple ways
    let projectId: any = null;
    
    try {
      // Try method 1: direct SELECT
      const allProjectsResult = await db.execute({
        sql: 'SELECT id FROM projects WHERE created_by = ? ORDER BY id DESC LIMIT 1',
        args: [userId]
      });
      
      if (allProjectsResult.rows && allProjectsResult.rows.length > 0) {
        projectId = (allProjectsResult.rows[0] as any).id;
        console.log('Got project ID via direct SELECT:', projectId);
      }
    } catch (e) {
      console.error('Method 1 failed:', e);
    }

    if (!projectId) {
      // Try method 2: MAX
      try {
        const maxResult = await db.execute({
          sql: 'SELECT MAX(id) as last_id FROM projects WHERE created_by = ?',
          args: [userId]
        });
        
        if (maxResult.rows && maxResult.rows.length > 0) {
          projectId = (maxResult.rows[0] as any).last_id;
          console.log('Got project ID via MAX:', projectId);
        }
      } catch (e) {
        console.error('Method 2 failed:', e);
      }
    }

    if (!projectId) {
      throw new Error('Could not retrieve project ID after insertion');
    }

    console.log('Project created with ID:', projectId);

    console.log('Project created with ID:', projectId);

    // Insert project photos (if any)
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // If it's an external URL (from GoFundMe), store the URL directly
        // If it's a base64 data URL, we would need to handle it differently
        let imageUrl = image.src;
        
        // For now, just store the image URL/data URL in the database
        // In production, you might want to upload base64 images to cloud storage
        await db.execute({
          sql: 'INSERT INTO project_photos (project_id, image_url) VALUES (?, ?)',
          args: [projectId, imageUrl]
        });

        // Set first image as main image if not already set
        if (i === 0) {
          await db.execute({
            sql: 'UPDATE projects SET main_image = ? WHERE id = ?',
            args: [imageUrl, projectId]
          });
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      projectId: projectId
    });
  } catch (error) {
    console.error('Error creating project:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error details:', errorMessage);
    return res.status(500).json({
      message: 'Error creating project',
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
