import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import type { Adapter } from 'next-auth/adapters';

const prisma = new PrismaClient();

export const authOptions:NextAuthOptions = {
  adapter:PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    async redirect({baseUrl}) {
      return baseUrl;
    },
    async session({session, user}) {
      if(session?.user) session.user.id = user.id;
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};