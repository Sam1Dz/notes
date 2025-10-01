import 'server-only';

import mongoose from 'mongoose';

import { envServer } from '~/core/config/env';
import type { MongoEntityId } from '~/shared/types/database';

const MONGODB_URI = envServer.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env',
  );
}

/**
 * Cache object for Mongoose connection to avoid multiple connections.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB using Mongoose with caching to reuse connections.
 */
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Higher-order function that ensures database connection before executing a handler.
 * This utility wraps database operations to guarantee connectivity.
 *
 * @typeParam T - The return type of the handler function.
 * @param handler - The async function to execute after ensuring database connection.
 * @returns A Promise that resolves to the result of the handler function.
 */
export async function withDatabase<T>(handler: () => Promise<T>): Promise<T> {
  await dbConnect();

  return handler();
}

/**
 * Converts a MongoDB ObjectId to its string representation.
 *
 * @param id - The MongoDB ObjectId to convert.
 * @returns The string representation of the ObjectId.
 */
export function stringifyObjectId(id: MongoEntityId): string {
  return id.toString();
}
