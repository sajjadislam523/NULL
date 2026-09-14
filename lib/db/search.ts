import { connectDB } from "@/lib/db/connect";
import { Post } from "@/models/Post";

export async function searchPublishedPosts(query: string, limit = 10) {
  await connectDB();
  const trimmed = query.trim();
  if (!trimmed) return [];

  return Post.find(
    { status: "PUBLISHED", $text: { $search: trimmed } },
    { score: { $meta: "textScore" } },
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .populate("category", "name slug")
    .lean();
}
