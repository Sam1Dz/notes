import { z } from 'zod';

import type { EntityType } from '~/shared/types/database';

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const refreshTokenSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

/* RESPONSE TYPES */
export interface LoginResponse {
  user: EntityType &
    Omit<LoginSchema, 'password' | 'rememberMe'> & {
      name: string;
    };
  token: {
    access: string;
    refresh: string;
  };
}

export type RegisterResponse = EntityType &
  Omit<RegisterSchema, 'password' | 'confirmPassword'>;
