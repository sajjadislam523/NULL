import Link from "next/link";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <TechnicalLabel>404 / NOT FOUND</TechnicalLabel>
      <h1 className="text-3xl">This page doesn&apos;t exist.</h1>
      <p className="max-w-sm text-foreground-secondary">
        It may have been moved, unpublished, or never existed at all.
      </p>
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground"
      >
        ← Back home
      </Link>
    </main>
  );
}
