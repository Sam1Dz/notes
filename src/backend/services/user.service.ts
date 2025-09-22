import bcrypt from 'bcryptjs';

import type { RegisterSchema } from '~/schemas/auth';

import User from '../models/user.model';

/**
 * Finds a user by their email address.
 *
 * @param email - The email address to search for.
 * @returns A Promise that resolves to the user document if found, or null if not found.
 */
export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

/**
 * Creates a new user with the provided registration data.
 * Hashes the password before storing it in the database.
 *
 * @param userData - The user registration data including name, email, and password.
 * @returns A Promise that resolves to the created user document.
 */
export async function createUser(userData: RegisterSchema) {
  const { name, email, password } = userData;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  return User.create({
    name,
    email,
    password: hashedPassword,
  });
}

/**
 * Verifies a plain text password against a hashed password using bcrypt.
 *
 * @param plainPassword - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A Promise that resolves to true if passwords match, false otherwise.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
