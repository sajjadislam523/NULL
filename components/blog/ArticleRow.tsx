import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IndexNumber } from "@/components/decorative/IndexNumber";
import { Metadata } from "@/components/decorative/Metadata";

export interface ArticleRowPost {
  title: string;
  slug: string;
  category: string | null;
  readingTime: number;
  publishedAt: string | null;
}

export function ArticleRow({ post, index }: { post: ArticleRowPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center justify-between gap-6 border-b border-border py-6 transition-colors duration-base hover:border-border-strong"
    >
      <div className="flex items-start gap-6">
        <IndexNumber value={index} />
        <div>
          <h3 className="text-lg text-foreground transition-transform duration-base group-hover:translate-x-1">
            {post.title}
          </h3>
          <Metadata
            items={[
              post.category,
              `${post.readingTime} MIN READ`,
              post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : null,
            ]}
            className="mt-2"
          />
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-base group-hover:translate-x-1 group-hover:text-foreground" />
    </Link>
  );
}
