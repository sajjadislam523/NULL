"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/models/Category";
import { Post } from "@/models/Post";
import { categorySchema } from "@/lib/validations/category";
import { requireUser } from "@/lib/auth/session";
import { canManageCategories } from "@/lib/permissions";
import { safely } from "@/lib/utils/action-error";

export type ActionResult = { success: true } | { success: false; error: string };

export async function createCategory(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageCategories(user.role)) {
    return { success: false, error: "You don't have permission to manage categories." };
  }

  return safely(async () => {
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

    await connectDB();
    if (await Category.exists({ slug: parsed.data.slug })) {
      return { success: false, error: "A category with this slug already exists." };
    }

    await Category.create({ ...parsed.data, description: parsed.data.description || undefined });
    revalidatePath("/admin/categories");
    revalidatePath("/blog");
    return { success: true };
  });
}

export async function updateCategory(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageCategories(user.role)) {
    return { success: false, error: "You don't have permission to manage categories." };
  }

  return safely(async () => {
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

    await connectDB();
    const existing = await Category.findById(id);
    if (!existing) return { success: false, error: "Category not found." };

    if (parsed.data.slug !== existing.slug && (await Category.exists({ slug: parsed.data.slug }))) {
      return { success: false, error: "A category with this slug already exists." };
    }

    const previousSlug = existing.slug;
    existing.set({ ...parsed.data, description: parsed.data.description || undefined });
    await existing.save();

    revalidatePath("/admin/categories");
    revalidatePath("/blog");
    revalidatePath(`/category/${previousSlug}`);
    if (existing.slug !== previousSlug) revalidatePath(`/category/${existing.slug}`);
    return { success: true };
  });
}

/**
 * Blocks deletion while posts reference the category unless `reassignTo`
 * points at another category to move them to first (§11, §33) — posts
 * can't be left with no category since it's a required field, so
 * reassignment is the only way past a non-empty category.
 */
export async function deleteCategory(id: string, reassignTo?: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!canManageCategories(user.role)) {
    return { success: false, error: "You don't have permission to manage categories." };
  }

  return safely(async () => {
    await connectDB();
    const category = await Category.findById(id);
    if (!category) return { success: false, error: "Category not found." };

    const postCount = await Post.countDocuments({ category: id });

    if (postCount > 0) {
      if (!reassignTo) {
        return {
          success: false,
          error: `${postCount} post${postCount === 1 ? "" : "s"} still use this category. Reassign them to another category to delete it.`,
        };
      }
      if (reassignTo === id || !(await Category.exists({ _id: reassignTo }))) {
        return { success: false, error: "Choose a different, existing category to reassign to." };
      }
      await Post.updateMany({ category: id }, { category: reassignTo });
    }

    await Category.deleteOne({ _id: id });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/posts");
    revalidatePath("/blog");
    revalidatePath(`/category/${category.slug}`);
    return { success: true };
  });
}
