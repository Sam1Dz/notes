import 'server-only';

import * as crypto from 'crypto';

import { cookies } from 'next/headers';

import { envServer } from '~/core/config/env';

/**
 * Represents the data stored in a user session.
 */
export interface SessionData {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: {
    access: string;
    refresh: string;
  };
  expirate: number;
  remember: boolean;
}

/**
 * Encrypts session data using AES-256-CBC encryption.
 * @param data - The plain text data to encrypt.
 * @returns The encrypted data as a string in the format 'iv:encrypted'.
 */
export function encryptSession(data: string) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(envServer.SESSION_SECRET, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts session data that was encrypted with encryptSession.
 * @param data - The encrypted data string in the format 'iv:encrypted'.
 * @returns The decrypted plain text data, or null if decryption fails.
 */
export function decryptSession(data: string): string | null {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(envServer.SESSION_SECRET, 'salt', 32);
    const parts = data.split(':');

    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted || null;
  } catch {
    return null;
  }
}

/**
 * Creates a new session by encrypting the session data and storing it in a cookie.
 * @param data - The session data to store.
 */
export async function createSession(data: SessionData) {
  const session = encryptSession(JSON.stringify(data));

  const cookieStore = await cookies();

  cookieStore.set('notes.session-token', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(data.expirate * 1000),
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Retrieves and decrypts the current session data from the cookie.
 * @returns The session data if valid, or null if no session or invalid.
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('notes.session-token')?.value;

  if (!sessionCookie) return null;

  const decrypted = decryptSession(sessionCookie);

  if (!decrypted) return null;

  return JSON.parse(decrypted);
}

/**
 * Updates the current session data by applying an updater function and re-encrypting.
 * @param updater - A function that takes the current session data and returns the updated data.
 */
export async function updateSession(
  updater: (current: SessionData) => SessionData,
) {
  const current = await getSession();

  if (!current) return;

  const updated = updater(current);

  await createSession(updated);
}

/**
 * Removes the session cookie, effectively logging out the user.
 */
export async function purgeSession() {
  const cookieStore = await cookies();

  cookieStore.delete('notes.session-token');
}
