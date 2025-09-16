import { NextResponse } from 'next/server';

import { dbConnect } from '~/libs/mongodb';

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
