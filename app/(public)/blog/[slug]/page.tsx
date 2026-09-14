import { notFound } from "next/navigation";
import Image from "next/image";
import { getPublishedPostBySlug } from "@/lib/db/posts";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { ArticleGallery } from "@/components/blog/ArticleGallery";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { Metadata as MetaRow } from "@/components/decorative/Metadata";
import { FadeIn } from "@/components/motion/FadeIn";
import { getSiteUrl } from "@/lib/utils/site";

export const revalidate = 300;

interface PopulatedCategory {
  name: string;
  slug: string;
}
interface PopulatedAuthor {
  name: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  const author = post.author as unknown as PopulatedAuthor | null;
  const title = `${post.title} — NULL /`;

  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      authors: author ? [author.name] : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Unpublished/draft posts 404 here — this query only ever matches PUBLISHED (§49).
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const category = post.category as unknown as PopulatedCategory | null;
  const author = post.author as unknown as PopulatedAuthor | null;
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: author ? { "@type": "Person", name: author.name } : undefined,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so a title/excerpt containing "</script>" can't break out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ReadingProgress />
      <article className="mx-auto max-w-190 px-6 py-16">
        <FadeIn className="space-y-6">
          <MetaRow items={[category?.name, `${post.readingTime} MIN READ`]} />
          <h1 className="text-3xl sm:text-4xl">{post.title}</h1>
          <p className="text-lg text-foreground-secondary">{post.excerpt}</p>
          <MetaRow items={[author?.name, dateLabel]} />
        </FadeIn>

        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            width={1600}
            height={900}
            priority
            sizes="(min-width: 768px) 760px, 100vw"
            className="my-10 h-auto w-full rounded-sm border border-border"
          />
        )}

        <ArticleContent content={post.content} />
        <ArticleGallery images={post.images} alt={post.title} />
      </article>
    </>
  );
}
