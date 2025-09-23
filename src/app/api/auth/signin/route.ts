import {
  findUserByEmail,
  verifyPassword,
} from '~/backend/services/user.service';
import { loginSchema } from '~/schemas/auth';
import type { MongoEntityId } from '~/types/core/entity';
import {
  apiError,
  apiSuccess,
  internalServerError,
} from '~/utils/core/api-response';
import { generateAccessToken, generateRefreshToken } from '~/utils/core/jwt';
import { stringifyObjectId, withDatabase } from '~/utils/core/mongodb';
import { withValidation } from '~/utils/shared/validation';

export async function POST(request: Request) {
  try {
    const { email, password } = await withValidation(request, loginSchema);

    return withDatabase(async () => {
      // Find user by email
      const user = await findUserByEmail(email);

      if (!user) {
        return apiError('UNAUTHORIZED', 401, [
          {
            detail: 'Invalid email or password',
            attr: 'email',
          },
        ]);
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return apiError('UNAUTHORIZED', 401, [
          {
            detail: 'Invalid email or password',
            attr: 'password',
          },
        ]);
      }

      // Generate JWT tokens
      const accessToken = generateAccessToken({
        userId: stringifyObjectId(user._id as MongoEntityId),
        email: user.email,
      });
      const refreshToken = generateRefreshToken({
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
            access: accessToken,
            refresh: refreshToken,
          },
        },
        'Login successful',
      );
    });
  } catch (error) {
    return internalServerError(error);
  }
}
