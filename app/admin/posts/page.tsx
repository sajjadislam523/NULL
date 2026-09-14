import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getPosts } from "@/lib/db/posts";
import { getCategories } from "@/lib/db/categories";
import { PostTable, type PostRow } from "@/components/admin/PostTable";
import { PostFilters } from "@/components/admin/PostFilters";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { buttonVariants } from "@/components/ui/Button";
import type { PostStatus } from "@/lib/constants";

export const metadata = { title: "NULL / COMMAND — Posts" };

interface PopulatedRef {
  _id: unknown;
  name: string;
  slug?: string;
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; q?: string; page?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const page = sp.page ? Number(sp.page) : 1;

  const [result, categories] = await Promise.all([
    getPosts({
      status: sp.status ? (sp.status as PostStatus) : undefined,
      category: sp.category || undefined,
      search: sp.q || undefined,
      authorId: user.role === "AUTHOR" ? user.id : undefined,
      page,
    }),
    getCategories(),
  ]);

  const rows: PostRow[] = result.items.map((p) => {
    const category = p.category as unknown as PopulatedRef | null;
    const author = p.author as unknown as PopulatedRef | null;
    return {
      _id: String(p._id),
      title: p.title,
      slug: p.slug,
      status: p.status,
      updatedAt: p.updatedAt.toISOString(),
      category: category ? { name: category.name, slug: category.slug ?? "" } : null,
      author: author ? { _id: String(author._id), name: author.name } : null,
    };
  });

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams();
    if (sp.status) params.set("status", sp.status);
    if (sp.category) params.set("category", sp.category);
    if (sp.q) params.set("q", sp.q);
    params.set("page", String(p));
    return `/admin/posts?${params.toString()}`;
  };

  return (
    <div className="space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
          <h1 className="text-2xl">Posts</h1>
        </div>
        <Link href="/admin/posts/new" className={buttonVariants()}>
          New Post
        </Link>
      </div>

      <PostFilters categories={categories.map((c) => ({ _id: String(c._id), name: c.name }))} />

      <div className="border border-border">
        <PostTable posts={rows} currentUserId={user.id} currentUserRole={user.role} />
      </div>

      {result.pages > 1 && (
        <div className="flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-widest text-foreground-secondary">
          {page > 1 && (
            <Link href={buildPageHref(page - 1)} className="hover:text-foreground">
              ← Prev
            </Link>
          )}
          <span>
            {page} / {result.pages}
          </span>
          {page < result.pages && (
            <Link href={buildPageHref(page + 1)} className="hover:text-foreground">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
