import jwt from 'jsonwebtoken';

import { envServer } from '~/configs/env';

/**
 * Generates a JWT access token with a 15-minute expiration.
 *
 * @param payload - The payload containing userId and email.
 * @returns The signed JWT access token string.
 */
export function generateAccessToken(payload: {
  userId: string;
  email: string;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      type: 'access',
    },
    envServer.JWT_ACCESS_SECRET,
    { expiresIn: '15m' },
  );
}

/**
 * Generates a JWT refresh token with a 7-day expiration.
 *
 * @param payload - The payload containing userId and email.
 * @returns The signed JWT refresh token string.
 */
export function generateRefreshToken(payload: {
  userId: string;
  email: string;
}): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      type: 'refresh',
    },
    envServer.JWT_REFRESH_SECRET,
    { expiresIn: '7d' },
  );
}
