import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionMarkerProps {
  children: ReactNode;
  className?: string;
}

/**
 * A section header treatment: mono uppercase label + a thin rule
 * extending to fill the remaining width — "FEATURED / 01",
 * "SYSTEM / OVERVIEW", "/CATEGORY" (§7, §16, §24, §27).
 */
export function SectionMarker({ children, className }: SectionMarkerProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* secondary, not muted — see TechnicalLabel's contrast note (§37) */}
      <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-foreground-secondary">
        {children}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  );
}
