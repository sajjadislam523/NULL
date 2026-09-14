import { connectDB } from "@/lib/db/connect";
import { Post } from "@/models/Post";
import type { PostStatus } from "@/lib/constants";

export interface GetPostsOptions {
  status?: PostStatus | PostStatus[];
  category?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getPosts(opts: GetPostsOptions = {}) {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (opts.status) filter.status = Array.isArray(opts.status) ? { $in: opts.status } : opts.status;
  if (opts.category) filter.category = opts.category;
  if (opts.authorId) filter.author = opts.authorId;
  if (opts.search) filter.$text = { $search: opts.search };

  const page = Math.max(1, opts.page ?? 1);
  const limit = opts.limit ?? 20;

  const query = Post.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("category", "name slug")
    .populate("author", "name email")
    .lean();

  if (opts.search) {
    query.sort({ score: { $meta: "textScore" } });
  } else {
    query.sort({ createdAt: -1 });
  }

  const [items, total] = await Promise.all([query, Post.countDocuments(filter)]);

  return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getPostById(id: string) {
  await connectDB();
  return Post.findById(id).lean();
}

/** Used by the public article page — never returns a non-PUBLISHED post (§49). */
export async function getPublishedPostBySlug(slug: string) {
  await connectDB();
  return Post.findOne({ slug, status: "PUBLISHED" })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .lean();
}

/**
 * Appends -2, -3, … to `base` until it's unique among posts, excluding
 * `excludeId` (the post being edited, so it doesn't collide with itself).
 */
export async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  await connectDB();
  let slug = base;
  let n = 2;
  while (await Post.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}
