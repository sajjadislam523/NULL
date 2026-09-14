import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted transition-colors duration-base outline-none",
        "hover:border-border-strong focus-visible:border-border-strong",
        "disabled:pointer-events-none disabled:opacity-40",
        "aria-invalid:border-foreground-secondary",
        className,
      )}
      {...props}
    />
  );
}
