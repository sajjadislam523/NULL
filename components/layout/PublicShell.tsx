"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { SearchOverlay } from "@/components/blog/SearchOverlay";

interface PublicShellProps {
  children: ReactNode;
  siteTitle: string;
  socialLinks: { label: string; url: string }[];
}

export function PublicShell({ children, siteTitle, socialLinks }: PublicShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar onOpenSearch={() => setSearchOpen(true)} />
      <div className="flex-1">{children}</div>
      <PublicFooter siteTitle={siteTitle} socialLinks={socialLinks} />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
