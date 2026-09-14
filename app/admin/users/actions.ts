"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { createUserSchema, updateUserRoleSchema, updateUserStatusSchema } from "@/lib/validations/user";
import { requireUser } from "@/lib/auth/session";
import { canManageUsers } from "@/lib/permissions";
import { safely } from "@/lib/utils/action-error";

export type ActionResult = { success: true } | { success: false; error: string };

export async function createUser(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageUsers(user.role)) return { success: false, error: "You don't have permission to manage users." };

  return safely(async () => {
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

    await connectDB();
    const email = parsed.data.email.toLowerCase();
    if (await User.exists({ email })) {
      return { success: false, error: "A user with this email already exists." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await User.create({
      name: parsed.data.name,
      email,
      passwordHash,
      role: parsed.data.role,
      avatar: parsed.data.avatar || undefined,
    });

    revalidatePath("/admin/users");
    return { success: true };
  });
}

export async function updateUserRole(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageUsers(user.role)) return { success: false, error: "You don't have permission to manage users." };

  return safely(async () => {
    const parsed = updateUserRoleSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

    if (id === user.id && parsed.data.role !== "ADMIN") {
      return { success: false, error: "You can't remove your own admin role." };
    }

    await connectDB();
    const result = await User.updateOne({ _id: id }, { role: parsed.data.role });
    if (result.matchedCount === 0) return { success: false, error: "User not found." };

    revalidatePath("/admin/users");
    return { success: true };
  });
}

export async function updateUserStatus(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageUsers(user.role)) return { success: false, error: "You don't have permission to manage users." };

  return safely(async () => {
    const parsed = updateUserStatusSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

    if (id === user.id && parsed.data.status === "DISABLED") {
      return { success: false, error: "You can't disable your own account." };
    }

    await connectDB();
    const result = await User.updateOne({ _id: id }, { status: parsed.data.status });
    if (result.matchedCount === 0) return { success: false, error: "User not found." };

    revalidatePath("/admin/users");
    return { success: true };
  });
}
