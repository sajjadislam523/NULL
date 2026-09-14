import Link from "next/link";
import { getPosts } from "@/lib/db/posts";
import { getCategories } from "@/lib/db/categories";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { Stagger } from "@/components/motion/Stagger";

export const metadata = {
  title: "NULL / WRITING",
  description: "Thoughts, experiments, observations & notes.",
  alternates: { canonical: "/blog" },
};
export const revalidate = 300;

interface PopulatedCategory {
  name: string;
  slug: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? Number(pageParam) : 1;

  const [{ items, pages }, categories] = await Promise.all([
    getPosts({ status: "PUBLISHED", page, limit: 15 }),
    getCategories(),
  ]);

  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2">
          <TechnicalLabel>/WRITING</TechnicalLabel>
          <h1 className="text-3xl sm:text-4xl">
            Thoughts, experiments,
            <br />
            observations &amp; notes.
          </h1>
        </div>

        <CategoryFilter categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />

        {items.length === 0 ? (
          <p className="py-12 text-foreground-secondary">No posts published yet.</p>
        ) : (
          <Stagger className="flex flex-col">
            {items.map((post, i) => (
              <ArticleRow
                key={post.slug}
                index={i + 1}
                post={{
                  title: post.title,
                  slug: post.slug,
                  category: (post.category as unknown as PopulatedCategory | null)?.name ?? null,
                  readingTime: post.readingTime,
                  publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
                }}
              />
            ))}
          </Stagger>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6 font-mono text-xs uppercase tracking-widest text-foreground-secondary">
            {page > 1 && (
              <Link href={`/blog?page=${page - 1}`} className="hover:text-foreground">
                ← Prev
              </Link>
            )}
            <span>
              {page} / {pages}
            </span>
            {page < pages && (
              <Link href={`/blog?page=${page + 1}`} className="hover:text-foreground">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
