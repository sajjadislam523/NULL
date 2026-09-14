import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";

/**
 * Cached per-request so every Server Component/Action on a single render
 * pass shares one DB revalidation instead of one each — see the comment
 * on session.strategy in lib/auth/options.ts for why that revalidation
 * happens at all.
 */
export const getCurrentUser = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user;
});

/** Redirects to /login if there's no authenticated session. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
