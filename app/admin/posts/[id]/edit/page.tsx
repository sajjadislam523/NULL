import { notFound, forbidden } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getPostById } from "@/lib/db/posts";
import { getCategories } from "@/lib/db/categories";
import { getUsers } from "@/lib/db/users";
import { canEditPost } from "@/lib/permissions";
import { PostEditor } from "@/components/editor/PostEditor";
import type { PostInput } from "@/lib/validations/post";

export const metadata = { title: "NULL / COMMAND — Edit Post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;

  const post = await getPostById(id);
  if (!post) notFound();
  if (!canEditPost(user.role, post.author.toString(), user.id)) forbidden();

  const [categories, users] = await Promise.all([getCategories(), getUsers()]);

  return (
    <PostEditor
      mode="edit"
      postId={id}
      currentUser={{ id: user.id, role: user.role }}
      categories={categories.map((c) => ({ _id: String(c._id), name: c.name }))}
      authors={users.map((u) => ({ _id: String(u._id), name: u.name }))}
      defaultValues={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content as PostInput["content"],
        coverImage: post.coverImage ?? "",
        images: post.images,
        category: post.category.toString(),
        tags: post.tags,
        author: post.author.toString(),
        status: post.status,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString().slice(0, 10) : undefined,
      }}
    />
  );
}
