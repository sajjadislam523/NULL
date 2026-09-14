import { Schema, model, models, type Types } from "mongoose";
import { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus } from "@/lib/constants";

export { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus };

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  /** Never returned by default queries — see `select: false` below. */
  passwordHash: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String },
    role: { type: String, enum: USER_ROLES, required: true, default: "AUTHOR" },
    status: { type: String, enum: USER_STATUSES, required: true, default: "ACTIVE" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const User = models.User ?? model<IUser>("User", userSchema);
