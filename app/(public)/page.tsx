import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/db/posts";
import { GridBackground } from "@/components/decorative/GridBackground";
import { StatusIndicator } from "@/components/decorative/StatusIndicator";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { SectionMarker } from "@/components/decorative/SectionMarker";
import { Metadata } from "@/components/decorative/Metadata";
import { ArticleRow } from "@/components/blog/ArticleRow";
import { FadeIn } from "@/components/motion/FadeIn";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";

// On-demand revalidation (revalidatePath in the admin Server Actions) is
// the primary mechanism; this is a time-based safety net in case a future
// mutation path forgets to call it (§39).
export const revalidate = 300;

export const metadata = { alternates: { canonical: "/" } };

interface PopulatedCategory {
  name: string;
  slug: string;
}

export default async function HomePage() {
  const { items } = await getPosts({ status: "PUBLISHED", limit: 7 });
  const [featured, ...latest] = items;

  return (
    <main>
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <GridBackground />
        <FadeIn className="mx-auto max-w-3xl space-y-8">
          <TechnicalLabel>/ DIGITAL JOURNAL</TechnicalLabel>
          <h1 className="text-4xl leading-tight sm:text-6xl">
            Ideas, experiments,
            <br />
            observations and things
            <br />
            worth thinking about.
          </h1>
          <Metadata items={["EST. 2026", "VOL. 01"]} />
          <div className="pt-4">
            <StatusIndicator label="ONLINE" />
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-foreground transition-colors duration-base hover:text-foreground-secondary"
          >
            Explore writing
            <ArrowRight className="h-4 w-4 transition-transform duration-base group-hover:translate-x-1" />
          </Link>
        </FadeIn>
      </section>

      {featured && (
        <Reveal>
          <section className="border-t border-border px-6 py-20">
            <div className="mx-auto max-w-5xl space-y-6">
              <SectionMarker>FEATURED / 01</SectionMarker>
              <Link href={`/blog/${featured.slug}`} className="group block space-y-4">
                <h2 className="text-3xl text-foreground transition-transform duration-base group-hover:translate-x-1 sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="max-w-2xl text-foreground-secondary">{featured.excerpt}</p>
                <Metadata
                  items={[
                    (featured.category as unknown as PopulatedCategory | null)?.name,
                    `${featured.readingTime} MIN READ`,
                    featured.publishedAt
                      ? new Date(featured.publishedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
                      : null,
                  ]}
                />
                {featured.coverImage && (
                  <Image
                    src={featured.coverImage}
                    alt=""
                    width={1600}
                    height={900}
                    priority
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="mt-4 h-auto w-full rounded-sm border border-border transition-transform duration-slow group-hover:scale-[1.01]"
                  />
                )}
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground-secondary">
                  Read article
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </section>
        </Reveal>
      )}

      {latest.length > 0 && (
        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-5xl space-y-6">
            <SectionMarker>LATEST</SectionMarker>
            <Stagger className="flex flex-col">
              {latest.map((post, i) => (
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
          </div>
        </section>
      )}
    </main>
  );
}
