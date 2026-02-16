import db from "@/db";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getUserbyId } from "@/lib/actions/user.actions";

export const { signIn, signOut, auth, handlers } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        if (!user.id) return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.isManager = token.isManager as boolean;

        const userInfo = await getUserbyId(token.sub);

        if (userInfo) {
          session.user.permissions =
            userInfo.permissions as unknown as string[];
          session.user.name = userInfo.name;
          session.user.code = userInfo.username;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (Array.isArray(user)) {
        token.sub = user[0]?.id;
        token.username = user[0].userName;
        token.isManager = user[0]?.isManager;
      }

      // เพิ่มเวลาหมดอายุ (เช่น หมดอายุหลังเที่ยงคืน)
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      token.exp = tomorrow.getTime();

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
