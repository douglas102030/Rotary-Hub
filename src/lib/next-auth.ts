import type { DefaultSession, NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByLogin, isUserActive, verifyPassword } from './auth';
import type { UserRole } from './auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await getUserByLogin(credentials.username);
        
        if (!user) {
          return null;
        }

        const isValid = await verifyPassword(credentials.password, user.password_hash);
        
        if (!isValid) {
          return null;
        }

        if (!isUserActive(user)) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role ?? 'registered_user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id?: string; role?: UserRole } }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? '';
        session.user.role = token.role ?? 'registered_user';
      }
      return session;
    },
    async signOut({ token }) {
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.PASSWORD_SECRET_KEY || 'rotary_hub_secret_key_2026',
};
