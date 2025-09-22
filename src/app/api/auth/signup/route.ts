import type mongoose from 'mongoose';

import { createUser, findUserByEmail } from '~/backend/services/user.service';
import { dbConnect } from '~/libs/mongodb';
import { registerSchema } from '~/schemas/auth';
import {
  apiError,
  apiSuccess,
  internalServerError,
  validationError,
} from '~/utils/core/api-response';

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return validationError(validationResult.error.issues);
    }

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await findUserByEmail(validationResult.data.email);

    if (existingUser) {
      return apiError('CONFLICT', 409, [
        {
          detail: 'User already exists with this email',
          attr: 'email',
        },
      ]);
    }

    // Create user in database
    const user = await createUser(validationResult.data);

    return apiSuccess(
      'CREATED',
      201,
      {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      'User registered successfully',
    );
  } catch (error) {
    return internalServerError(error);
  }
}
