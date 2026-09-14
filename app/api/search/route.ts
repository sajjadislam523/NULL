import { NextResponse } from "next/server";
import { searchPublishedPosts } from "@/lib/db/search";

interface PopulatedCategory {
  name: string;
  slug: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchPublishedPosts(q);

  return NextResponse.json({
    results: results.map((p) => {
      const category = p.category as unknown as PopulatedCategory | null;
      return {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        category: category?.name ?? "",
        readingTime: p.readingTime,
        publishedAt: p.publishedAt,
      };
    }),
  });
}
