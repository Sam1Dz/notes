import type { MongoEntityId } from '~/lib/database/type';
import { refreshTokenSchema } from '~/lib/schemas/auth';
import { findUserByEmail } from '~/lib/services/user';
import {
  apiError,
  apiSuccess,
  internalServerError,
} from '~/lib/utils/api/response';
import { withValidation } from '~/lib/utils/api/validation';
import {
  decodeAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '~/lib/utils/auth/jwt';
import { stringifyObjectId, withDatabase } from '~/lib/utils/database/mongodb';

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await withValidation(
      request,
      refreshTokenSchema,
    );

    return withDatabase(async () => {
      // Decode the access token (without expiration check)
      const accessDecoded = decodeAccessToken(accessToken);

      if (!accessDecoded) {
        return apiError('UNAUTHORIZED', 401, [
          {
            detail: 'Invalid access token',
            attr: 'accessToken',
          },
        ]);
      }

      // Verify the refresh token
      const refreshDecoded = verifyRefreshToken(refreshToken);

      if (!refreshDecoded) {
        return apiError('UNAUTHORIZED', 401, [
          {
            detail: 'Invalid or expired refresh token',
            attr: 'refreshToken',
          },
        ]);
      }

      // Ensure both tokens belong to the same user
      if (
        accessDecoded.userId !== refreshDecoded.userId ||
        accessDecoded.email !== refreshDecoded.email
      ) {
        return apiError('UNAUTHORIZED', 401, [
          {
            detail: 'Token mismatch - tokens belong to different users',
            attr: 'tokens',
          },
        ]);
      }

      // Find the user to ensure they still exist
      const user = await findUserByEmail(refreshDecoded.email);

      if (!user) {
        return apiError('UNAUTHORIZED', 401, [
          {
            detail: 'User not found',
            attr: 'tokens',
          },
        ]);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        userId: stringifyObjectId(user._id as MongoEntityId),
        email: user.email,
      });

      const newRefreshToken = generateRefreshToken({
        userId: stringifyObjectId(user._id as MongoEntityId),
        email: user.email,
      });

      return apiSuccess(
        'OK',
        200,
        {
          user: {
            id: stringifyObjectId(user._id as MongoEntityId),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
          token: {
            access: newAccessToken,
            refresh: newRefreshToken,
          },
        },
        'Token refreshed successfully',
      );
    });
  } catch (error) {
    return internalServerError(error);
  }
}
