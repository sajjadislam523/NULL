import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-sm border border-border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted transition-colors duration-base outline-none",
        "hover:border-border-strong focus-visible:border-border-strong",
        "disabled:pointer-events-none disabled:opacity-40",
        "aria-invalid:border-foreground-secondary",
        className,
      )}
      {...props}
    />
  );
}
