import { requireUser } from "@/lib/auth/session";
import { getCategories } from "@/lib/db/categories";
import { getUsers } from "@/lib/db/users";
import { PostEditor } from "@/components/editor/PostEditor";

export const metadata = { title: "NULL / COMMAND — New Post" };

export default async function NewPostPage() {
  const user = await requireUser();
  const [categories, users] = await Promise.all([getCategories(), getUsers()]);

  return (
    <PostEditor
      mode="create"
      currentUser={{ id: user.id, role: user.role }}
      categories={categories.map((c) => ({ _id: String(c._id), name: c.name }))}
      authors={users.map((u) => ({ _id: String(u._id), name: u.name }))}
    />
  );
}
