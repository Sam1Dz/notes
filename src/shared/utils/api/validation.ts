import type { z } from 'zod';

import { validationError } from '~/shared/utils/api/response';

/**
 * Validates a request body against a Zod schema and returns the parsed data.
 * If validation fails, throws a validation error response.
 *
 * @typeParam T - The type of the validated data returned by the schema.
 * @param request - The incoming request object to validate.
 * @param schema - The Zod schema to validate the request body against.
 * @returns A Promise that resolves to the validated and parsed data.
 * @throws Throws a validation error response if the request body doesn't match the schema.
 */
export async function withValidation<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const body = await request.json();
  const validationResult = schema.safeParse(body);

  if (!validationResult.success) {
    throw validationError(validationResult.error.issues);
  }

  return validationResult.data;
}
