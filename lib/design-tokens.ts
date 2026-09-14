/**
 * JS-side mirror of the CSS tokens in app/globals.css, for places that
 * can't reach for a Tailwind class — Framer Motion transitions, computed
 * layout math, etc. Colors/radius/duration values must stay in sync with
 * the @theme block in globals.css; there is no build-time link between
 * the two, so a token change has to be made in both places.
 */

export const colors = {
  background: "#090909",
  surface: "#101010",
  elevated: "#151515",
  border: "#272727",
  borderStrong: "#3a3a3a",
  foreground: "#f2f2f2",
  foregroundSecondary: "#a0a0a0",
  foregroundMuted: "#626262",
} as const;

/**
 * Design spec's spacing step -> the Tailwind utility number that produces
 * it (Tailwind's default scale is 4px per step, so these line up exactly).
 */
export const spacingSteps = {
  4: 1,
  8: 2,
  12: 3,
  16: 4,
  24: 6,
  32: 8,
  48: 12,
  64: 16,
  96: 24,
  128: 32,
  160: 40,
} as const;

/** Seconds, for Framer Motion `transition.duration`. */
export const motionDuration = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
} as const;

/** Shared easing curve — fast-out, no bounce/overshoot. */
export const motionEase = [0.16, 1, 0.3, 1] as const;
