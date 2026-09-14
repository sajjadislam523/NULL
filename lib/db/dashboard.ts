import { connectDB } from "@/lib/db/connect";
import { Post } from "@/models/Post";
import { User } from "@/models/User";

export async function getDashboardStats() {
  await connectDB();
  const [total, published, drafts, users] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: "PUBLISHED" }),
    Post.countDocuments({ status: "DRAFT" }),
    User.countDocuments(),
  ]);
  return { total, published, drafts, users };
}

export async function getRecentPosts(limit = 5) {
  await connectDB();
  return Post.find().sort({ updatedAt: -1 }).limit(limit).populate("author", "name").lean();
}
