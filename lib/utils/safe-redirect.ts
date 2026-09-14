/**
 * Restricts a user-supplied redirect target (e.g. a `callbackUrl` query
 * param) to a same-origin relative path, so it can't be used as an open
 * redirect to an external domain.
 */
export function safeRedirect(target: string | undefined, fallback: string): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  return target;
}
