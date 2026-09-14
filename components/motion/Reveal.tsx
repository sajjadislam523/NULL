"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { motionDuration, motionEase } from "@/lib/design-tokens";

export interface RevealProps extends HTMLMotionProps<"div"> {
  y?: number;
}

/** Same entrance as FadeIn, but triggered on scroll into view rather than on mount. */
export function Reveal({ y = 16, transition, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: reduceMotion ? motionDuration.fast : motionDuration.base,
        ease: motionEase,
        ...transition,
      }}
      {...props}
    />
  );
}
