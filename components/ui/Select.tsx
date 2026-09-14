import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * A styled native <select>. Native rather than a custom listbox — it's
 * fully accessible and keyboard-operable for free, and this app has no
 * need yet for options beyond plain text (icons, descriptions, etc).
 */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-sm border border-border bg-surface px-3 pr-9 text-sm text-foreground transition-colors duration-base outline-none",
          "hover:border-border-strong focus-visible:border-border-strong",
          "disabled:pointer-events-none disabled:opacity-40",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
      />
    </div>
  );
}
