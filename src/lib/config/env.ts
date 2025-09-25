import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Server-side environment variables configuration.
 * Uses `@t3-oss/env-nextjs` to validate and provide type-safe access to environment variables.
 */
export const envServer = createEnv({
  server: {
    MONGODB_URI: z.url(),
    JWT_ACCESS_SECRET: z
      .string()
      .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: z
      .string()
      .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  },
  experimental__runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  },
});
