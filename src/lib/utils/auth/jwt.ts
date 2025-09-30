import 'server-only';

import jwt, { type JwtPayload } from 'jsonwebtoken';

import { envServer } from '~/lib/config/env';

/**
 * Represents a JWT token payload with user information and token type.
 * Extends JwtPayload to include custom fields for user authentication.
 */
export type JWT = Pick<JwtPayload, 'iat' | 'exp'> & {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
};

/**
 * Generates a JWT access token with a 15-minute expiration.
 * The access token is used for authenticating API requests.
 *
 * @param payload - The payload containing userId and email for the token.
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
 * The refresh token is used to obtain new access tokens without re-authentication.
 *
 * @param payload - The payload containing userId and email for the token.
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
 * Validates the token signature and ensures it's a refresh token type.
 *
 * @param token - The refresh token string to verify.
 * @returns The decoded token payload if valid, null if invalid or not a refresh token.
 */
export function verifyRefreshToken(token: string): JWT | null {
  try {
    const decoded = jwt.verify(token, envServer.JWT_REFRESH_SECRET) as JWT;

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
 * Does not check if the token is expired.
 *
 * @param token - The access token string to decode.
 * @returns The decoded token payload if valid format, null if invalid or not an access token.
 */
export function decodeAccessToken(token: string): JWT | null {
  try {
    const decoded = jwt.verify(token, envServer.JWT_ACCESS_SECRET, {
      ignoreExpiration: true,
    }) as JWT;

    // Ensure it's an access token
    if (decoded.type !== 'access') {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
