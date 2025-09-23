import { createUser, findUserByEmail } from '~/backend/services/user.service';
import { registerSchema } from '~/schemas/auth';
import type { MongoEntityId } from '~/types/core/entity';
import {
  apiError,
  apiSuccess,
  internalServerError,
} from '~/utils/core/api-response';
import { stringifyObjectId, withDatabase } from '~/utils/core/mongodb';
import { withValidation } from '~/utils/shared/validation';

export async function POST(request: Request) {
  try {
    const validationResult = await withValidation(request, registerSchema);

    return withDatabase(async () => {
      // Check if user already exists
      const existingUser = await findUserByEmail(validationResult.email);

      if (existingUser) {
        return apiError('CONFLICT', 409, [
          {
            detail: 'User already exists with this email',
            attr: 'email',
          },
        ]);
      }

      // Create user in database
      const user = await createUser(validationResult);

      return apiSuccess(
        'CREATED',
        201,
        {
          id: stringifyObjectId(user._id as MongoEntityId),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        'User registered successfully',
      );
    });
  } catch (error) {
    return internalServerError(error);
  }
}
