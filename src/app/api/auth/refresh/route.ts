import { refreshTokenSchema } from '~/features/auth/schemas/auth';
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
    const tokens = await withValidation(request, refreshTokenSchema);

    return await withDatabase(async () => {
      const refreshedPayload = await authService.refreshSession(tokens);

      return apiSuccess(
        'OK',
        200,
        refreshedPayload,
        'Token refreshed successfully',
      );
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError('UNAUTHORIZED', error.status, [
        { detail: error.message, attr: 'token' },
      ]);
    }

    if (error instanceof Response) {
      return error;
    }

    return internalServerError(error);
  }
}
