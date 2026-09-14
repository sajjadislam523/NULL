import { Search } from "lucide-react";
import { searchPublishedPosts } from "@/lib/db/search";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { Metadata } from "@/components/decorative/Metadata";
import Link from "next/link";

export const metadata = { title: "NULL / SEARCH" };

interface PopulatedCategory {
  name: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchPublishedPosts(q) : [];

  return (
    <main className="px-6 py-20">
      <div className="mx-auto max-w-2xl space-y-10">
        <TechnicalLabel>SEARCH</TechnicalLabel>
        <h1 className="text-2xl">What are you looking for?</h1>

        <form method="GET" className="flex items-center gap-3 border-b border-border-strong pb-4">
          <Search className="h-5 w-5 text-foreground-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search articles…"
            className="w-full bg-transparent text-xl text-foreground outline-none placeholder:text-foreground-muted"
          />
        </form>

        {q && (
          <div>
            <TechnicalLabel className="mb-4 block">RESULTS</TechnicalLabel>
            {results.length === 0 ? (
              <p className="text-foreground-secondary">No results for &quot;{q}&quot;.</p>
            ) : (
              <ul className="divide-y divide-border">
                {results.map((r) => (
                  <li key={r.slug} className="py-4">
                    <Link href={`/blog/${r.slug}`} className="block">
                      <div className="text-lg text-foreground">{r.title}</div>
                      <Metadata
                        items={[
                          (r.category as unknown as PopulatedCategory | null)?.name,
                          r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : null,
                          `${r.readingTime} MIN READ`,
                        ]}
                        className="mt-1"
                      />
                      <p className="mt-1 text-sm text-foreground-secondary">{r.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
