import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, userPasswords } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function verifyPassword(
  email: string,
  password: string
): Promise<{ id: string; email: string; name: string | null } | null> {
  try {
    const rows = await db
      .select()
      .from(userPasswords)
      .where(eq(userPasswords.email, email))
      .limit(1);

    if (!rows.length) return null;

    const isValid = await bcrypt.compare(password, rows[0].passwordHash);
    if (!isValid) return null;

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, rows[0].userId))
      .limit(1);

    if (!userRows.length) return null;

    return {
      id: userRows[0].id,
      email: userRows[0].email,
      name: userRows[0].name,
    };
  } catch (error) {
    console.error("Password verification failed:", error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyPassword(
          credentials.email as string,
          credentials.password as string
        );

        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email.split("@")[0],
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.email = user.email ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  trustHost: true,
});
