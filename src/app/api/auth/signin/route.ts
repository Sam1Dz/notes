import { loginSchema } from '~/lib/schemas/auth';
import * as authService from '~/lib/services/auth';
import { ApiError } from '~/lib/utils/api/error';
import {
  apiError,
  apiSuccess,
  internalServerError,
} from '~/lib/utils/api/response';
import { withValidation } from '~/lib/utils/api/validation';
import { withDatabase } from '~/lib/utils/database/mongodb';

export async function POST(request: Request) {
  try {
    const credentials = await withValidation(request, loginSchema);

    return await withDatabase(async () => {
      const loginPayload = await authService.signIn(credentials);

      return apiSuccess('OK', 200, loginPayload, 'Login successful');
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError('UNAUTHORIZED', error.status, [
        { detail: error.message, attr: null },
      ]);
    }

    if (error instanceof Response) {
      return error;
    }

    return internalServerError(error);
  }
}
