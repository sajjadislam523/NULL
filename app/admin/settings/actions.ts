"use server";

import { revalidatePath } from "next/cache";
import { getSettings } from "@/lib/db/settings";
import { settingsSchema } from "@/lib/validations/settings";
import { requireUser } from "@/lib/auth/session";
import { canManageSettings } from "@/lib/permissions";
import { safely } from "@/lib/utils/action-error";

export type ActionResult = { success: true } | { success: false; error: string };

export async function updateSettings(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageSettings(user.role)) {
    return { success: false, error: "You don't have permission to manage settings." };
  }

  return safely(async () => {
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

    const settings = await getSettings();
    settings.set(parsed.data);
    await settings.save();

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true };
  });
}
