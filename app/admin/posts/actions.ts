"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/connect";
import { Post } from "@/models/Post";
import { Category } from "@/models/Category";
import { postSchema } from "@/lib/validations/post";
import { requireUser } from "@/lib/auth/session";
import { canDeletePost, canEditPost, canPublish } from "@/lib/permissions";
import { ensureUniqueSlug } from "@/lib/db/posts";
import { slugify } from "@/lib/utils/slug";
import { safely } from "@/lib/utils/action-error";
import type { PostStatus } from "@/lib/constants";

export type ActionResult = { success: true; id?: string } | { success: false; error: string };

export async function createPost(input: unknown): Promise<ActionResult> {
  const user = await requireUser();

  return safely(async () => {
    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }
    const data = parsed.data;

    if (data.status === "PUBLISHED" && !canPublish(user.role)) {
      return { success: false, error: "You don't have permission to publish posts." };
    }

    await connectDB();
    const categoryExists = await Category.exists({ _id: data.category });
    if (!categoryExists) return { success: false, error: "Selected category does not exist." };

    // AUTHOR can only ever author their own posts.
    const author = user.role === "AUTHOR" ? user.id : data.author;
    const slug = await ensureUniqueSlug(data.slug || slugify(data.title));

    const post = await Post.create({
      ...data,
      slug,
      author,
      coverImage: data.coverImage || undefined,
      publishedAt: data.status === "PUBLISHED" ? (data.publishedAt ?? new Date()) : data.publishedAt,
    });

    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath("/blog");
    return { success: true, id: post._id.toString() };
  });
}

export async function updatePost(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireUser();

  return safely(async () => {
    await connectDB();

    const existing = await Post.findById(id);
    if (!existing) return { success: false, error: "Post not found." };
    if (!canEditPost(user.role, existing.author.toString(), user.id)) {
      return { success: false, error: "You don't have permission to edit this post." };
    }

    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }
    const data = parsed.data;

    const wasPublished = existing.status === "PUBLISHED";
    if (data.status === "PUBLISHED" && !wasPublished && !canPublish(user.role)) {
      return { success: false, error: "You don't have permission to publish posts." };
    }

    const categoryExists = await Category.exists({ _id: data.category });
    if (!categoryExists) return { success: false, error: "Selected category does not exist." };

    const author = user.role === "AUTHOR" ? existing.author.toString() : data.author;
    const slug = data.slug !== existing.slug ? await ensureUniqueSlug(data.slug, id) : data.slug;

    existing.set({
      ...data,
      slug,
      author,
      coverImage: data.coverImage || undefined,
      publishedAt:
        data.status === "PUBLISHED" && !existing.publishedAt ? new Date() : (data.publishedAt ?? existing.publishedAt),
    });
    await existing.save();

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${id}/edit`);
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { success: true };
  });
}

export async function deletePost(id: string): Promise<ActionResult> {
  const user = await requireUser();

  return safely(async () => {
    await connectDB();

    const existing = await Post.findById(id);
    if (!existing) return { success: false, error: "Post not found." };
    if (!canDeletePost(user.role, existing.author.toString(), user.id)) {
      return { success: false, error: "You don't have permission to delete this post." };
    }

    await existing.deleteOne();

    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath("/blog");
    return { success: true };
  });
}

export async function setPostStatus(id: string, status: PostStatus): Promise<ActionResult> {
  const user = await requireUser();
  if (!canPublish(user.role)) {
    return { success: false, error: "You don't have permission to publish/unpublish posts." };
  }

  return safely(async () => {
    await connectDB();
    const existing = await Post.findById(id);
    if (!existing) return { success: false, error: "Post not found." };

    existing.status = status;
    if (status === "PUBLISHED" && !existing.publishedAt) existing.publishedAt = new Date();
    await existing.save();

    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    return { success: true };
  });
}
