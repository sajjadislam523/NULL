"use client";

import { useEffect } from "react";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { Button } from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <TechnicalLabel>ERROR</TechnicalLabel>
      <h1 className="text-3xl">Something went wrong.</h1>
      <p className="max-w-sm text-foreground-secondary">
        An unexpected error occurred. Try again, or come back later.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
