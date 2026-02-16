import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BASED_URL = process.env.BASED_URL || "http://localhost:3000";

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        pin: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.username !== "string" ||
          typeof credentials.pin !== "string"
        ) {
          throw new Error("CredentialsSignin");
          // return null;
        }

        try {
          const { username, pin } = credentials;

          const apiUrl = `${BASED_URL}/api/signin/`;

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              pin,
            }),
          });

          if (!response.ok) {
            throw new Error("CredentialsSignin");
            // return null;
          }

          const fromLocalAPI = await response.json();

          if (!fromLocalAPI.success || !fromLocalAPI.data) {
            throw new Error("CredentialsSignin");
            // return null;
          }

          // return user object
          return fromLocalAPI.data;
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
