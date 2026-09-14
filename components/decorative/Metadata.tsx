import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface MetadataProps {
  items: ReactNode[];
  separator?: ReactNode;
  className?: string;
}

/**
 * A row of small mono metadata — category, reading time, date, etc,
 * e.g. "DEVELOPMENT · 08 MIN READ · 12 SEP 2026" (§5, §25, §28).
 */
export function Metadata({ items, separator = "/", className }: MetadataProps) {
  const visible = items.filter((item) => item !== null && item !== undefined && item !== "");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground-secondary",
        className,
      )}
    >
      {visible.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-foreground-muted">{separator}</span>}
          {item}
        </span>
      ))}
    </div>
  );
}
