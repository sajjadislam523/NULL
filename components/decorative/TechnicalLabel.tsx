import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Small mono, uppercase, wide-tracked label used for technical framing
 * throughout the UI — "/WRITING", "/ABOUT", "EST. 2026" (§5, §7).
 *
 * Uses the secondary text color, not muted: at text-xs, muted (#626262)
 * only reaches ~3.3:1 against the background, below WCAG AA's 4.5:1 for
 * normal-size text (§37) — and this label is real content in most call
 * sites (section headers, statuses, error codes), not decoration.
 */
export function TechnicalLabel({ className, children, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-foreground-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
