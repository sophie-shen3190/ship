import GoogleProvider from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  debug: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Sign in attempt:', { user, account, profile });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect:', { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
};
