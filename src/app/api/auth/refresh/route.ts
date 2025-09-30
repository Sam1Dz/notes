import { refreshTokenSchema } from '~/lib/schemas/auth';
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
