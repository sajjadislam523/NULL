import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validations/user";

/**
 * Session strategy: JWT, not database sessions.
 *
 * NextAuth v4 refuses to start with `session.strategy: "database"` when
 * Credentials is the only provider (it throws `UnsupportedStrategy` —
 * there's no OAuth account to link a DB session to). So role/status
 * changes can't be enforced by invalidating a session row.
 *
 * Instead, the `jwt` callback below re-reads the user from MongoDB on
 * every request that checks the session (it's invoked on every
 * getServerSession/session-route call, not just at sign-in) and clears
 * the token if the account is disabled or gone. `getCurrentUser()` in
 * lib/auth/session.ts wraps that in React's `cache()` so it only costs
 * one query per request, not one per component. Net effect is the same
 * "takes effect on the next request" guarantee database sessions would
 * have given — just reached a different way.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 }, // 12h
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select(
          "+passwordHash",
        );
        if (!user || user.status !== "ACTIVE") return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (!token.id) return token;

      await connectDB();
      const dbUser = await User.findById(token.id);
      if (!dbUser || dbUser.status !== "ACTIVE") {
        // Disabled or deleted since the token was issued — invalidate it.
        return {};
      }

      token.role = dbUser.role;
      token.name = dbUser.name;
      return token;
    },
    async session({ session, token }) {
      // token.id/role are absent when the jwt() callback above invalidated
      // the token (disabled/deleted user) — leave session.user's id/role
      // unset in that case. getCurrentUser() treats a missing id as "no
      // user" regardless of what the augmented Session type claims. The
      // raw /api/auth/session response can still echo the stale name/email
      // NextAuth seeded before this callback ran; that's the user's own
      // already-known info, not a cross-user leak, and nothing in the app
      // trusts a session without `id`, so it's left as-is.
      if (token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
