import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getDashboardStats, getRecentPosts } from "@/lib/db/dashboard";
import { canManageUsers } from "@/lib/permissions";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { SectionMarker } from "@/components/decorative/SectionMarker";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { PostTable, type PostRow } from "@/components/admin/PostTable";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = { title: "NULL / COMMAND" };

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const [stats, recentPosts] = await Promise.all([getDashboardStats(), getRecentPosts(5)]);

  const rows: PostRow[] = recentPosts.map((p) => ({
    _id: String(p._id),
    title: p.title,
    slug: p.slug,
    status: p.status,
    updatedAt: p.updatedAt.toISOString(),
    category: null,
    author: p.author ? { _id: String((p.author as { _id: unknown })._id), name: (p.author as { name: string }).name } : null,
  }));

  return (
    <div className="space-y-10 px-6 py-10">
      <div className="space-y-2">
        <TechnicalLabel>SYSTEM / OVERVIEW</TechnicalLabel>
        <h1 className="text-2xl">Command Center</h1>
      </div>

      <DashboardStats stats={stats} />

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/posts/new" className={buttonVariants()}>
          New Post
        </Link>
        <Link href="/admin/posts" className={buttonVariants({ variant: "secondary" })}>
          Manage Posts
        </Link>
        {canManageUsers(user.role) && (
          <Link href="/admin/users" className={buttonVariants({ variant: "secondary" })}>
            Manage Users
          </Link>
        )}
      </div>

      <div className="border border-border">
        <div className="border-b border-border px-6 py-4">
          <SectionMarker>RECENT POSTS</SectionMarker>
        </div>
        <PostTable posts={rows} currentUserId={user.id} currentUserRole={user.role} />
      </div>
    </div>
  );
}
