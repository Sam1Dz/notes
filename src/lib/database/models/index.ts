import type { Model } from 'mongoose';

import mongoose from 'mongoose';

import { userSchema, type UserModels } from './user';

export const User: Model<UserModels> =
  mongoose.models.User || mongoose.model<UserModels>('User', userSchema);
