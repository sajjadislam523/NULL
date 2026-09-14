import { cn } from "@/lib/utils/cn";

export interface IndexNumberProps {
  value: number;
  padLength?: number;
  className?: string;
}

/**
 * Zero-padded index used for article rows, featured slots, etc — "01", "02" (§7).
 * Secondary, not muted — see TechnicalLabel's contrast note (§37).
 */
export function IndexNumber({ value, padLength = 2, className }: IndexNumberProps) {
  return (
    <span
      className={cn(
        "font-mono text-sm tabular-nums text-foreground-secondary",
        className,
      )}
    >
      {String(value).padStart(padLength, "0")}
    </span>
  );
}
