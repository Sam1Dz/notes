import { registerSchema } from '~/features/auth/schemas/auth';
import * as authService from '~/features/auth/services/auth';
import { ApiError } from '~/shared/utils/api/error';
import {
  apiError,
  apiSuccess,
  internalServerError,
} from '~/shared/utils/api/response';
import { withValidation } from '~/shared/utils/api/validation';
import { withDatabase } from '~/core/lib/database/mongodb';

export async function POST(request: Request) {
  try {
    const data = await withValidation(request, registerSchema);

    return await withDatabase(async () => {
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

    if (error instanceof Response) {
      return error;
    }

    return internalServerError(error);
  }
}
