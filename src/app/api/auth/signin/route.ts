import type mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

import {
  findUserByEmail,
  verifyPassword,
} from '~/backend/services/user.service';
import { envServer } from '~/configs/env';
import { dbConnect } from '~/libs/mongodb';
import { loginSchema } from '~/schemas/auth';
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

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return validationError(validationResult.error.issues);
    }

    const { email, password } = validationResult.data;

    // Connect to database
    await dbConnect();

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
    const accessToken = jwt.sign(
      {
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        email: user.email,
        type: 'access',
      },
      envServer.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }, // 15 minutes
    );

    const refreshToken = jwt.sign(
      {
        userId: (user._id as mongoose.Types.ObjectId).toString(),
        email: user.email,
        type: 'refresh',
      },
      envServer.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }, // 7 days
    );

    return apiSuccess(
      'OK',
      200,
      {
        user: {
          id: (user._id as mongoose.Types.ObjectId).toString(),
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
  } catch (error) {
    return internalServerError(error);
  }
}
