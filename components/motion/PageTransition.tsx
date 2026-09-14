"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionDuration, motionEase } from "@/lib/design-tokens";

/**
 * Entrance transition for route changes. Drop this inside a route
 * segment's `template.tsx` (which Next.js remounts on every navigation,
 * unlike `layout.tsx`) so each page fades/rises in on arrival.
 *
 * Exit animations are intentionally out of scope: coordinating an
 * AnimatePresence exit across an App Router navigation requires holding
 * the outgoing route's server-rendered tree alive during the transition,
 * which is significant added complexity for a "fast and subtle" effect
 * (§36) that mostly needs to be felt on entrance.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? motionDuration.fast : motionDuration.base,
        ease: motionEase,
      }}
    >
      {children}
    </motion.div>
  );
}
