import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * `template.tsx` remounts on every navigation (unlike `layout.tsx`), which
 * is what gives each public page a fresh entrance transition.
 */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
