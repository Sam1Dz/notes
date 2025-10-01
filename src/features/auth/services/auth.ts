'use server';

import bcrypt from 'bcryptjs';

import type { MongoEntityId } from '~/shared/types/database';
import type {
  LoginResponse,
  LoginSchema,
  RegisterSchema,
} from '~/features/auth/schemas/auth';
import * as userService from '~/features/auth/services/user';
import { ApiError } from '~/shared/utils/api/error';
import {
  decodeAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '~/features/auth/utils/jwt';
import { stringifyObjectId } from '~/core/lib/database/mongodb';

/**
 * Registers a new user account.
 * Validates that the email is not already taken, hashes the password,
 * creates the user in the database, and returns the user information.
 *
 * @param data - The registration data including name, email, and password.
 * @returns A Promise that resolves to the created user information (without password).
 * @throws ApiError if a user with the given email already exists (409 status).
 */
export async function signUp(data: RegisterSchema) {
  const existingUser = await userService.findUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError('User already exists with this email', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const newUser = await userService.createUser({
    name: data.name,
    email: data.email,
    password_hashed: hashedPassword,
  });

  return {
    id: stringifyObjectId(newUser._id as MongoEntityId),
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt.toISOString(),
    updatedAt: newUser.updatedAt.toISOString(),
  };
}

/**
 * Authenticates a user with email and password credentials.
 * Validates the credentials, generates access and refresh tokens,
 * and returns the user information along with the tokens.
 *
 * @param credentials - The login credentials including email and password.
 * @returns A Promise that resolves to an object containing user info and JWT tokens.
 * @throws ApiError if the email/password combination is invalid (401 status).
 */
export async function signIn(credentials: LoginSchema): Promise<LoginResponse> {
  const user = await userService.findUserByEmail(credentials.email);

  if (!user || !user.password) {
    throw new ApiError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new ApiError('Invalid email or password', 401);
  }

  const userId = stringifyObjectId(user._id as MongoEntityId);

  const accessToken = generateAccessToken({ userId, email: user.email });
  const refreshToken = generateRefreshToken({ userId, email: user.email });

  return {
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    token: {
      access: accessToken,
      refresh: refreshToken,
    },
  };
}

/**
 * Refreshes the user's session by validating the provided tokens and issuing new ones.
 * Decodes the access token, verifies the refresh token, ensures token consistency,
 * confirms the user exists, and generates a new pair of access and refresh tokens.
 *
 * @param tokens - An object containing the current access and refresh tokens.
 * @returns A Promise that resolves to an object containing user info and new JWT tokens.
 * @throws ApiError if tokens are invalid, expired, mismatched, or user not found (401 status).
 */
export async function refreshSession(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  const { accessToken, refreshToken } = tokens;

  // 1. Decode the access token (without expiration check)
  const accessDecoded = decodeAccessToken(accessToken);

  if (!accessDecoded) {
    throw new ApiError('Invalid access token', 401);
  }

  // 2. Verify the refresh token is valid and not expired
  const refreshDecoded = verifyRefreshToken(refreshToken);

  if (!refreshDecoded) {
    throw new ApiError('Invalid or expired refresh token', 401);
  }

  // 3. Ensure both tokens belong to the same user
  if (accessDecoded.userId !== refreshDecoded.userId) {
    throw new ApiError('Token mismatch', 401);
  }

  // 4. Find the user to ensure they still exist
  const user = await userService.findUserByEmail(refreshDecoded.email);

  if (!user) {
    throw new ApiError('User not found', 401);
  }

  const userId = stringifyObjectId(user._id as MongoEntityId);

  // 5. Generate a new pair of tokens
  const newAccessToken = generateAccessToken({ userId, email: user.email });
  const newRefreshToken = generateRefreshToken({ userId, email: user.email });

  // 6. Return the same payload structure as the signIn function
  return {
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    token: {
      access: newAccessToken,
      refresh: newRefreshToken,
    },
  };
}
