import type mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import User from '~/databases/user';
import { dbConnect } from '~/libs/mongodb';
import { registerSchema } from '~/schemas/auth';
import type { RegisterResponse } from '~/types/auth';
import type { ApiErrorType, ApiSuccessType } from '~/types/core/response';

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errorResponse: ApiErrorType = {
        type: 'client_error',
        code: 'BAD_REQUEST',
        errors: validationResult.error.issues.map((issue) => ({
          detail: issue.message,
          attr: issue.path.join('.'),
        })),
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { name, email, password } = validationResult.data;

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const errorResponse: ApiErrorType = {
        type: 'client_error',
        code: 'CONFLICT',
        errors: [
          {
            detail: 'User already exists with this email',
            attr: 'email',
          },
        ],
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success response
    const successResponse: ApiSuccessType<RegisterResponse> = {
      code: 'CREATED',
      detail: 'User registered successfully',
      data: {
        id: (user._id as mongoose.Types.ObjectId).toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);

    const errorResponse: ApiErrorType = {
      type: 'server_error',
      code: 'INTERNAL_SERVER_ERROR',
      errors: [
        {
          detail: error instanceof Error ? error.message : 'Unknown error',
          attr: null,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
