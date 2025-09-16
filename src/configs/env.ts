import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Server-side environment variables configuration.
 * Uses `@t3-oss/env-nextjs` to validate and provide type-safe access to environment variables.
 */
export const envServer = createEnv({
  server: {
    MONGODB_URI: z.url(),
  },
  experimental__runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
});
