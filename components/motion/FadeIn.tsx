"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { motionDuration, motionEase } from "@/lib/design-tokens";

export interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/** Entrance transition: opacity 0 -> 1, y 12 -> 0 (§36). */
export function FadeIn({ delay = 0, y = 12, transition, ...props }: FadeInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? motionDuration.fast : motionDuration.base,
        delay: reduceMotion ? 0 : delay,
        ease: motionEase,
        ...transition,
      }}
      {...props}
    />
  );
}
