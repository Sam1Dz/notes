import type mongoose from 'mongoose';

export interface EntityType {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type MongoEntityId = mongoose.Types.ObjectId;
