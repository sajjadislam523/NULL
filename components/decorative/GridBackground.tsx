import { cn } from "@/lib/utils/cn";

/**
 * A very faint grid, purely atmospheric — never allowed to compete with
 * content (§7). Pure CSS, no JS, safe to render on any server component.
 */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        opacity: 0.15,
        maskImage: "linear-gradient(to bottom, black, transparent)",
      }}
    />
  );
}
