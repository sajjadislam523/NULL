"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: "/blog", label: "WRITING" },
  { href: "/about", label: "ABOUT" },
];

export function PublicNavbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg tracking-tight text-foreground">
          NULL /
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-xs uppercase tracking-widest transition-colors duration-base",
                pathname.startsWith(link.href) ? "text-foreground" : "text-foreground-secondary hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" /> Search
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-haspopup="dialog"
          className="font-mono text-xs uppercase tracking-widest text-foreground-secondary md:hidden"
        >
          NULL / MENU
        </button>
      </div>

      {mobileOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="text-lg text-foreground">NULL /</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="-m-1.5 p-1.5 text-foreground-secondary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start justify-center gap-8 px-6">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-3xl text-foreground">
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenSearch();
              }}
              className="text-3xl text-foreground"
            >
              SEARCH
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
