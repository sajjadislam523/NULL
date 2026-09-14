import { cn } from "@/lib/utils/cn";

export interface StatusIndicatorProps {
  label: string;
  active?: boolean;
  className?: string;
}

/**
 * A small dot + mono label — "ONLINE" in the homepage hero (§23), or a
 * post's DRAFT/PUBLISHED state in the admin. The dot is the one place a
 * fully rounded shape is allowed — a tiny status light, not a card.
 */
export function StatusIndicator({ label, active = true, className }: StatusIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-foreground" : "bg-foreground-muted",
        )}
      />
      <span className="font-mono text-xs uppercase tracking-widest text-foreground-secondary">
        {label}
      </span>
    </span>
  );
}
