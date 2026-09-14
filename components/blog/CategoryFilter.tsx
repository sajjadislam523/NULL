import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface CategoryFilterProps {
  categories: { name: string; slug: string }[];
  activeSlug?: string;
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-6 border-b border-border pb-4">
      <Link
        href="/blog"
        className={cn(
          "font-mono text-xs uppercase tracking-widest transition-colors duration-base",
          !activeSlug ? "text-foreground" : "text-foreground-secondary hover:text-foreground",
        )}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className={cn(
            "font-mono text-xs uppercase tracking-widest transition-colors duration-base",
            activeSlug === c.slug ? "text-foreground" : "text-foreground-secondary hover:text-foreground",
          )}
        >
          {c.name}
        </Link>
      ))}
    </nav>
  );
}
