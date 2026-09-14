/**
 * Wraps a Server Action's body so an unexpected error (DB connection
 * drop, a Mongoose validation error that slipped past Zod, etc.) never
 * reaches the client as a raw message or stack trace (§40, §43) — it
 * logs server-side and returns a generic, safe result instead.
 *
 * Must wrap only the part of the action AFTER any requireUser()/redirect()
 * call, since those throw a special Next.js control-flow signal that this
 * would otherwise swallow.
 */
export async function safely<T extends { success: boolean }>(fn: () => Promise<T>): Promise<T | { success: false; error: string }> {
  try {
    return await fn();
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
