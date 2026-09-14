"use client";

import { useEffect, useState } from "react";

/** Thin top progress line (§29). CSS transition duration already respects prefers-reduced-motion globally. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div aria-hidden="true" className="fixed left-0 top-0 z-40 h-px w-full bg-border">
      <div className="h-full bg-foreground transition-[width] duration-100" style={{ width: `${progress}%` }} />
    </div>
  );
}
