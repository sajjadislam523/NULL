"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils/cn";

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground",
        className,
      )}
    >
      Logout
    </button>
  );
}
