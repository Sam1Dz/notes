import { NextResponse } from 'next/server';

import { dbConnect } from '~/libs/mongodb';
import type { ApiSuccessType, ErrorResponseType } from '~/types/core/response';

export async function GET() {
  try {
    await dbConnect();

    const successResponse: ApiSuccessType<null> = {
      code: 'OK',
      detail: 'Database connection successful',
      data: null,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(successResponse);
  } catch (error) {
    console.error('Database connection error:', error);

    const errorResponse: ErrorResponseType = {
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
