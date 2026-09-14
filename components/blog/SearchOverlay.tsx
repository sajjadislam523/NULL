"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Metadata } from "@/components/decorative/Metadata";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";

interface SearchResult {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: number;
  publishedAt: string | null;
}

/**
 * The parent only mounts this when open (`{searchOpen && <SearchOverlay .../>}`)
 * rather than passing an `open` prop — that way every field resets for
 * free on each fresh mount instead of needing an effect to reset state
 * when a prop flips, which is the pattern React's own lint rules now flag.
 */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } catch {
        // aborted or transient — ignore
      }
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const visibleResults = query.trim() ? results : [];

  function go(slug: string) {
    onClose();
    router.push(`/blog/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleResults.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && visibleResults[activeIndex]) {
      go(visibleResults[activeIndex].slug);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-50 flex flex-col bg-background/98"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mx-auto w-full max-w-2xl px-6 pt-20">
        <div className="mb-8 flex items-center justify-between">
          <TechnicalLabel>SEARCH</TechnicalLabel>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="-m-1.5 p-1.5 text-foreground-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mb-6 text-2xl">What are you looking for?</h2>

        <div className="flex items-center gap-3 border-b border-border-strong pb-4">
          <Search className="h-5 w-5 text-foreground-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search articles…"
            className="w-full bg-transparent text-xl text-foreground outline-none placeholder:text-foreground-muted"
          />
        </div>

        {visibleResults.length > 0 && (
          <div className="mt-2">
            <TechnicalLabel className="mb-4 block">RESULTS</TechnicalLabel>
            <ul className="divide-y divide-border">
              {visibleResults.map((r, i) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => go(r.slug)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`block w-full py-4 text-left transition-colors duration-base ${i === activeIndex ? "text-foreground" : "text-foreground-secondary"}`}
                  >
                    <div className="text-lg">{r.title}</div>
                    <Metadata
                      items={[
                        r.category,
                        r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : null,
                        `${r.readingTime} MIN READ`,
                      ]}
                      className="mt-1"
                    />
                    <p className="mt-1 text-sm text-foreground-secondary">{r.excerpt}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {query.trim() && visibleResults.length === 0 && (
          <p className="mt-8 text-sm text-foreground-secondary">No results for &quot;{query}&quot;.</p>
        )}
      </div>
    </div>
  );
}
