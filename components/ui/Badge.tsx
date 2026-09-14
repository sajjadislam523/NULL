import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  default: "border-border text-foreground-secondary",
  solid: "border-foreground bg-foreground text-background",
  outline: "border-border-strong text-foreground",
} as const;

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2 py-0.5 font-mono text-xs uppercase tracking-wider",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
