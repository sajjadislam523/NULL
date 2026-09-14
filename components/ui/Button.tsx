import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-foreground text-background border border-foreground hover:bg-transparent hover:text-foreground",
  secondary:
    "bg-transparent text-foreground border border-border hover:border-border-strong",
  ghost:
    "bg-transparent text-foreground-secondary border border-transparent hover:text-foreground",
} as const;

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

export interface ButtonVariantProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

/**
 * Shares Button's visual treatment with non-<button> elements — a `Link`
 * styled as a button, for instance. `<Link>` renders an `<a>`, and an `<a>`
 * can never be nested inside a `<button>`, so this is the way to reuse the
 * look without invalid HTML.
 */
export function buttonVariants({ variant = "primary", size = "md" }: ButtonVariantProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium tracking-tight transition-colors duration-base disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
  );
}

export interface ButtonProps extends ComponentProps<"button">, ButtonVariantProps {}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
