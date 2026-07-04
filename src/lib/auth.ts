import bcrypt from 'bcryptjs';
import { getDatebaseClient, initDatebase } from './database';

export interface User {
  id: number;
  username?: string | null;
  full_name: string;
  email: string;
  password_hash: string;
  club_name?: string | null;
  position?: string | null;
  phone_number?: string | null;
  country_region?: string | null;
  is_active?: boolean | null;
  role?: 'admin' | 'club_manager' | 'registered_user';
}

export type UserRole = NonNullable<User['role']>;

export interface Session {
  user_id: number;
  token: string;
  expires_at: Date;
}

type SqliteRow = Record<string, unknown>;

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

function convertRowToUser(row: SqliteRow): User | null {
  if (!row || !Object.keys(row).length) return null;
  
  try {
    const id = parseInt(String(row.id), 10);
    if (isNaN(id)) throw new Error('Invalid ID');

    const isActiveValue = row.is_active;

    return {
      id,
      username: row.username ? String(row.username) : null,
      full_name: String(row.full_name ?? ''),
      email: String(row.email ?? ''),
      password_hash: String(row.password_hash ?? ''),
      club_name: row.club_name ? String(row.club_name) : null,
      position: row.position ? String(row.position) : null,
      phone_number: row.phone_number ? String(row.phone_number) : null,
      country_region: row.country_region ?? row.country ? String(row.country_region ?? row.country) : null,
      is_active: isActiveValue === null || isActiveValue === undefined
        ? null
        : ['1', 'true'].includes(String(isActiveValue).toLowerCase()),
      role: ['admin', 'club_manager', 'registered_user'].includes(String(row.role))
        ? String(row.role) as UserRole
        : 'registered_user',
    };
  } catch (error) {
    console.error('Error converting database row to user:', error);
    return null;
  }
}

export async function createUser(userDate: {
  username?: string;
  full_name: string;
  email: string;
  password: string;
  club_name: string;
  position: string;
  phone_number: string;
  country: string;
}): Promise<User | null> {
  await initDatebase();
  const client = getDatebaseClient();

  const password_hash = await hashPassword(userDate.password);

  try {
    const result = await client.execute({
      sql: `
        INSERT INTO users 
          (username, full_name, email, password_hash, club_name, position, phone_number, country)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, username, full_name, email, password_hash, club_name, position, phone_number, country, role, is_active
      `,
      args: [
        userDate.username || null,
        userDate.full_name,
        userDate.email,
        password_hash,
        userDate.club_name || null,
        userDate.position || null,
        userDate.phone_number || '',
        userDate.country || null
      ]
    });

    if (result.rows && result.rows.length > 0) {
      const converted = convertRowToUser(result.rows[0]);
      return converted;
    }

    throw new Error('Error creating user');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'User creation failed';
    console.error('createUser error:', message);
    throw new Error(message);
  }
}

export async function getUserByLogin(identifier: string): Promise<User | null> {
  await initDatebase();
  const client = getDatebaseClient();
  const normalizedIdentifier = identifier.trim().toLowerCase();

  try {
    const result = await client.execute({
      sql: `
        SELECT id, username, full_name, email, password_hash, club_name, position, phone_number, country, role, is_active
        FROM users
        WHERE lower(email) = ? OR lower(username) = ?
      `,
      args: [normalizedIdentifier, normalizedIdentifier]
    });

    if (result.rows && result.rows.length > 0) {
      const converted = convertRowToUser(result.rows[0]);
      return converted;
    }

    return null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'User lookup failed';
    console.error('getUserByLogin error:', message);
    throw new Error(message);
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return getUserByLogin(email);
}

export async function getUserById(id: number): Promise<User | null> {
  await initDatebase();
  const client = getDatebaseClient();

  try {
    const result = await client.execute({
      sql: `SELECT id, username, full_name, email, password_hash, club_name, position, phone_number, country, role, is_active FROM users WHERE id = ?`,
      args: [id]
    });

    if (result.rows && result.rows.length > 0) {
      return convertRowToUser(result.rows[0]) as unknown as User | null;
    }
    
    return null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'User lookup by ID failed';
    console.error('getUserById error:', message);
    throw new Error(message);
  }

}

export function isUserActive(user: User): boolean {
  const isActive = user.is_active;
  
  if (isActive === null || isActive === undefined) return true; 
  if (typeof isActive === 'boolean') return isActive;
  if (String(isActive).toLowerCase() === 'true') return true;

  return false;
}

export function hasPermission(user: User, requiredRole: UserRole | 'all'): boolean {
  const userRole = String(user.role || '').toLowerCase();
  if (requiredRole.toLowerCase() === 'all') return true;

  const roleHierarchy: Record<string, number> = {
    admin: 3, club_manager: 2, registered_user: 1 };

  return (roleHierarchy[userRole] ?? -Infinity) >= roleHierarchy[requiredRole];
}
