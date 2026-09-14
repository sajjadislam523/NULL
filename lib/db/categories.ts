import { connectDB } from "@/lib/db/connect";
import { Category } from "@/models/Category";
import { Post } from "@/models/Post";

export async function getCategories() {
  await connectDB();
  return Category.find().sort({ name: 1 }).lean();
}

export async function getCategoryBySlug(slug: string) {
  await connectDB();
  return Category.findOne({ slug }).lean();
}

export async function getCategoryById(id: string) {
  await connectDB();
  return Category.findById(id).lean();
}

/** category id (string) -> number of posts referencing it. */
export async function getCategoryPostCounts(): Promise<Map<string, number>> {
  await connectDB();
  const counts = await Post.aggregate<{ _id: unknown; count: number }>([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  return new Map(counts.map((c) => [String(c._id), c.count]));
}
