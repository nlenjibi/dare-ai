import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth"];
      const isPublic = PUBLIC_PATHS.some(
        (p) => nextUrl.pathname === p || nextUrl.pathname.startsWith(p)
      );
      if (isPublic) return true;
      return isLoggedIn;
    },
    session({ session, token }) {
      // Only copy token.id if it looks like a MongoDB ObjectId (24 hex chars).
      // Google OAuth UUID tokens from old sessions are rejected here.
      const id = token.id as string | undefined;
      if (id && /^[0-9a-f]{24}$/.test(id) && session.user) {
        (session.user as { id: string }).id = id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
};
