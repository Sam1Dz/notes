import type { $ZodIssue } from 'zod/v4/core';

import { NextResponse } from 'next/server';

/**
 * Standard response type for successful API operations.
 * @template T - The type of the data payload.
 */
export interface ResponseType<T> {
  data: T | null;
}

/**
 * Paginated response type for API operations that return lists of data.
 * @template T - The type of the data items in the array.
 */
export interface PaginatedResponseType<T> {
  data: T[];
  meta: {
    page: number;
    totalPage: number;
    totalData: number;
  };
}

/**
 * Error response type for API operations that fail.
 */
export interface ErrorResponseType {
  type: 'client_error' | 'server_error';
  code: string;
  errors: {
    detail: string;
    attr: string | null;
  }[];
  timestamp: string;
}

/**
 * Union type for all possible success response types.
 * @template T - The type of the data payload.
 */
export type ApiSuccessType<T> = (ResponseType<T> | PaginatedResponseType<T>) & {
  code: string;
  detail: string;
  timestamp: string;
};

/**
 * Type alias for error responses.
 */
export type ApiErrorType = ErrorResponseType;

/**
 * Returns a standardized API error response using NextResponse.
 *
 * @param code - Error code identifier (e.g., 'BAD_REQUEST', 'NOT_FOUND').
 * @param status - HTTP status code for the response.
 * @param errors - Array of error objects with details and attributes.
 * @param type - Error type ('client_error' or 'server_error'). Defaults to 'client_error'.
 * @returns NextResponse containing the error payload.
 */
export function apiError(
  code: ApiErrorType['code'],
  status: number,
  errors: ApiErrorType['errors'],
  type: ApiErrorType['type'] = 'client_error',
) {
  const errorResponse: ApiErrorType = {
    type,
    code,
    errors,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * Returns a standardized API success response using NextResponse.
 *
 * @typeParam T - Type of the data payload.
 * @param code - Success code identifier.
 * @param status - HTTP status code for the response.
 * @param data - Data payload to return.
 * @param detail - Human-readable detail message.
 * @returns NextResponse containing the success payload.
 */
export function apiSuccess<T>(
  code: ApiSuccessType<T>['code'],
  status: number,
  data: T,
  detail: string,
) {
  const successResponse: ApiSuccessType<T> = {
    code,
    detail,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(successResponse, { status });
}

/**
 * Returns a standardized validation error response from Zod issues.
 *
 * @param issues - Array of Zod validation issues.
 * @returns NextResponse containing the validation error payload.
 */
export function validationError(issues: $ZodIssue[]) {
  const errors = issues.map((issue) => ({
    detail: issue.message,
    attr: issue.path.join('.'),
  }));

  return apiError('BAD_REQUEST', 400, errors);
}

/**
 * Returns a standardized internal server error response.
 * Logs the error to the console.
 *
 * @param error - The error object or message.
 * @returns NextResponse containing the internal server error payload.
 */
export function internalServerError(error: unknown) {
  console.error('API Route Error:', error);
  const detail =
    error instanceof Error ? error.message : 'Unknown server error';

  return apiError(
    'INTERNAL_SERVER_ERROR',
    500,
    [{ detail, attr: null }],
    'server_error',
  );
}
