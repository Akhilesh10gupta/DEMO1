import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      token?: string;
    } & DefaultSession['user'];
  }

  interface User {
    token?: string;
  }
}
