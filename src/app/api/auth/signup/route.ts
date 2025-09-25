import { registerSchema } from '~/lib/schemas/auth';
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
    const data = await withValidation(request, registerSchema);

    return withDatabase(async () => {
      const newUser = await authService.signUp(data);

      return apiSuccess(
        'CREATED',
        201,
        newUser,
        'User registered successfully',
      );
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(
        error.status === 409 ? 'CONFLICT' : 'BAD_REQUEST',
        error.status,
        [{ detail: error.message, attr: 'email' }],
      );
    }

    return internalServerError(error);
  }
}
