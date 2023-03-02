import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
export default NextAuth({
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // validate here your username and password
        if (email !== 'a' && password !== 'a') {
          throw new Error('invalid credentials');
        }
        // confirmed users
        return { id: 1, name: 'Alex', email: 'alex@email.com' } as any;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
});
