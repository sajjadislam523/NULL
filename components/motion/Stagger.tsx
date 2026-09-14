"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { motionDuration, motionEase } from "@/lib/design-tokens";

export interface StaggerProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Seconds between each child's entrance. */
  staggerDelay?: number;
  y?: number;
}

/**
 * Wraps each direct child in its own fade/rise entrance, staggered in
 * sequence — used for article-row lists, dashboard stat groups, etc.
 * Children may themselves be server components; only this wrapper is
 * a client boundary.
 */
export function Stagger({ children, staggerDelay = 0.06, y = 12, ...props }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? motionDuration.fast : motionDuration.base, ease: motionEase },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: { staggerChildren: reduceMotion ? 0 : staggerDelay },
        },
      }}
      {...props}
    >
      {Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
