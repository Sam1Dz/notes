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

/**
 * Verifies and decodes a JWT refresh token.
 *
 * @param token - The refresh token to verify.
 * @returns The decoded token payload if valid, null if invalid.
 */
export function verifyRefreshToken(token: string): {
  userId: string;
  email: string;
  type: string;
} | null {
  try {
    const decoded = jwt.verify(token, envServer.JWT_REFRESH_SECRET) as {
      userId: string;
      email: string;
      type: string;
    };

    // Ensure it's a refresh token
    if (decoded.type !== 'refresh') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Decodes a JWT access token without verifying expiration.
 * Used for validating token ownership during refresh operations.
 *
 * @param token - The access token to decode.
 * @returns The decoded token payload if valid format, null if invalid.
 */
export function decodeAccessToken(token: string): {
  userId: string;
  email: string;
  type: string;
} | null {
  try {
    const decoded = jwt.verify(token, envServer.JWT_ACCESS_SECRET, {
      ignoreExpiration: true,
    }) as {
      userId: string;
      email: string;
      type: string;
    };

    // Ensure it's an access token
    if (decoded.type !== 'access') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
