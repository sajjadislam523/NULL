import { z } from "zod";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(USER_ROLES),
  avatar: z.string().url().optional().or(z.literal("")),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(USER_STATUSES),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;
