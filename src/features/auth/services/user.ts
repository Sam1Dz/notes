'use server';

import { User } from '~/core/lib/database/models';

/**
 * Payload interface for creating a new user.
 * Contains the required fields for user registration.
 */
export interface CreateUserPayload {
  name: string;
  email: string;
  password_hashed: string;
}

/**
 * Finds a user by their email address.
 * Includes the password field in the selection for authentication purposes.
 *
 * @param email - The email address to search for.
 * @returns A Promise that resolves to the user document if found (with password), or null if not found.
 */
export async function findUserByEmail(email: string) {
  return User.findOne({ email }).select('+password');
}

/**
 * Creates a new user in the database with the provided payload.
 *
 * @param payload - The user creation payload containing name, email, and hashed password.
 * @returns A Promise that resolves to the created user document.
 */
export async function createUser(payload: CreateUserPayload) {
  return User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password_hashed,
  });
}
