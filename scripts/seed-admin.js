const bcrypt = require('bcryptjs');
const { createClient } = require('@libsql/client');
const { config } = require('dotenv');

config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
});

async function ensureColumn(tableName, columnName, definition) {
  const result = await client.execute(`PRAGMA table_info(${tableName})`);
  const hasColumn = result.rows.some((row) => String(row.name) === columnName);

  if (!hasColumn) {
    await client.execute(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function initDatabase() {
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
}

async function seedAdmin() {
  await initDatabase();

  const passwordHash = await bcrypt.hash('!@Douglas@102030', 12);

  await client.execute({
    sql: `
      INSERT INTO users (
        username,
        full_name,
        email,
        password_hash,
        club_name,
        position,
        country,
        role,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(username) DO UPDATE SET
        full_name = excluded.full_name,
        email = excluded.email,
        password_hash = excluded.password_hash,
        club_name = excluded.club_name,
        position = excluded.position,
        country = excluded.country,
        role = excluded.role,
        is_active = excluded.is_active,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [
      'admin',
      'Super Admin',
      'admin@rotaryhub.local',
      passwordHash,
      'Rotary Club HUB',
      'Super Admin',
      'United States',
      'admin',
      true,
    ],
  });

  console.log('Super admin is ready: username "admin".');
}

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
