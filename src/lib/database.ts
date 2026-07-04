// Datebase table definitions
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config();

// SQLite client for local development
const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
});

async function ensureColumn(tableName: string, columnName: string, definition: string) {
  const result = await client.execute(`PRAGMA table_info(${tableName})`);
  const hasColumn = result.rows.some((row) => String(row.name) === columnName);

  if (!hasColumn) {
    await client.execute(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

// Create or migrate the required tables
export async function initDatebase() {
  try {
    // Users
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        club_name TEXT,
        position TEXT,
        phone_number TEXT,
        country TEXT,
        role TEXT DEFAULT 'registered_user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await ensureColumn('users', 'username', 'TEXT UNIQUE');

    // Ensure fundraising columns exist in projects table
    await ensureColumn('projects', 'raised', 'DECIMAL(10, 2) DEFAULT 0');
    await ensureColumn('projects', 'goal', 'DECIMAL(10, 2) DEFAULT 0');
    await ensureColumn('projects', 'crowdfunder_url', 'TEXT');
    await ensureColumn('projects', 'gofundme_url', 'TEXT');
    await ensureColumn('projects', 'last_progress_update', 'DATETIME');

    // Pre-access requests
    await client.execute(`
      CREATE TABLE IF NOT EXISTS access_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        club_name TEXT,
        position TEXT,
        phone_number TEXT,
        country TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects
    await client.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        club_name TEXT,
        category TEXT,
        location TEXT,
        description TEXT,
        status TEXT DEFAULT 'draft',
        start_date DATE,
        end_date DATE,
        fundraising_link TEXT,
        external_links TEXT,
        main_image TEXT,
        contact_person TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Project photos
    await client.execute(`
      CREATE TABLE IF NOT EXISTS project_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        image_url TEXT NOT NULL,
        caption TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // Project documents
    await client.execute(`
      CREATE TABLE IF NOT EXISTS project_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        document_url TEXT NOT NULL,
        file_name TEXT,
        file_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // Project comments
    await client.execute(`
      CREATE TABLE IF NOT EXISTS project_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        user_id INTEGER,
        comment_text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Roles
    await client.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Default roles
    await client.execute(`
      INSERT OR IGNORE INTO roles (name, description) VALUES 
        ('admin', 'System administrator'),
        ('club_manager', 'Club manager'),
        ('registered_user', 'Registered user')
    `);

    // Audit logs
    await client.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        table_name TEXT,
        record_id INTEGER,
        old_values TEXT,
        new_values TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Get the database client
export function getDatebaseClient() {
  return client;
}
