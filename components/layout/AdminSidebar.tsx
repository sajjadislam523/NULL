"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { canManageCategories, canManageUsers } from "@/lib/permissions";
import type { UserRole } from "@/lib/constants";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { LogoutButton } from "@/components/layout/LogoutButton";

interface NavItem {
  href: string;
  label: string;
}

export function AdminSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items: NavItem[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts" },
    ...(canManageUsers(role) ? [{ href: "/admin/users", label: "Users" }] : []),
    ...(canManageCategories(role) ? [{ href: "/admin/categories", label: "Categories" }] : []),
    ...(canManageUsers(role) ? [{ href: "/admin/settings", label: "Settings" }] : []),
  ];

  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "rounded-sm px-3 py-2 text-sm transition-colors duration-base",
            isActive(item.href)
              ? "bg-surface text-foreground"
              : "text-foreground-secondary hover:bg-surface hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
        <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-foreground-secondary hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="-m-1.5 p-1.5 text-foreground-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex h-[calc(100%-53px)] flex-col justify-between py-4">
            {nav}
            <div className="px-6">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border py-6 md:flex">
        <div className="px-6 pb-6">
          <TechnicalLabel>NULL / COMMAND</TechnicalLabel>
        </div>
        {nav}
        <div className="mt-6 px-6">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
