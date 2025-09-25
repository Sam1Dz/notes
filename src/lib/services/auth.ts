import bcrypt from 'bcryptjs';

import type { MongoEntityId } from '~/lib/database/type';
import type { LoginSchema, RegisterSchema } from '~/lib/schemas/auth';
import * as userService from '~/lib/services/user';
import { ApiError } from '~/lib/utils/api/error';
import {
  generateAccessToken,
  generateRefreshToken,
} from '~/lib/utils/auth/jwt';
import { stringifyObjectId } from '~/lib/utils/database/mongodb';

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
export async function signIn(credentials: LoginSchema) {
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
