import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.id) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        if (token?.id) session.user.id = token.id as number;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const prisma = new PrismaClient();
        await prisma.$connect();
        const user = await prisma.user.findUnique({ where: { email: email } });
        await prisma.$disconnect();
        if (user?.password === password) {
          const userData = { ...user, password: undefined };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return userData as any;
        }
        throw new Error('invalid credentials');
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
});
