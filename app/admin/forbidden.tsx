import Link from "next/link";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";

export default function Forbidden() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center text-foreground">
      <TechnicalLabel>403 / FORBIDDEN</TechnicalLabel>
      <h1 className="text-2xl">You don&apos;t have permission to view this.</h1>
      <p className="max-w-sm text-sm text-foreground-secondary">
        Your account doesn&apos;t have the role required for this section.
      </p>
      <Link
        href="/admin"
        className="font-mono text-xs uppercase tracking-widest text-foreground-secondary transition-colors duration-base hover:text-foreground"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}
