import 'server-only';

import mongoose, { type Document } from 'mongoose';

export interface UserModels extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema = new mongoose.Schema<UserModels>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  },
);
