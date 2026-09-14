import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getCategoryBySlug } from "@/lib/db/categories";
import { getPosts } from "@/lib/db/posts";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { Stagger } from "@/components/motion/Stagger";

export const revalidate = 300;

interface PopulatedCategory {
  name: string;
  slug: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const title = `NULL / ${category.name.toUpperCase()}`;
  return {
    title,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title, description: category.description, url: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam ? Number(pageParam) : 1;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ items, pages }, categories] = await Promise.all([
    getPosts({ status: "PUBLISHED", category: String(category._id), page, limit: 15 }),
    getCategories(),
  ]);

  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2">
          <TechnicalLabel>/CATEGORY</TechnicalLabel>
          <h1 className="text-3xl sm:text-4xl">{category.name}</h1>
          {category.description && <p className="max-w-2xl text-foreground-secondary">{category.description}</p>}
        </div>

        <CategoryFilter categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} activeSlug={slug} />

        {items.length === 0 ? (
          <p className="py-12 text-foreground-secondary">No posts in this category yet.</p>
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
              <Link href={`/category/${slug}?page=${page - 1}`} className="hover:text-foreground">
                ← Prev
              </Link>
            )}
            <span>
              {page} / {pages}
            </span>
            {page < pages && (
              <Link href={`/category/${slug}?page=${page + 1}`} className="hover:text-foreground">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
