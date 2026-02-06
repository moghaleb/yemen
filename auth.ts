import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const email = (credentials?.email as string)?.trim();
                const password = (credentials?.password as string)?.trim();

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse({ email, password });

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log('Attempting login for:', email);
                    const user = await getUser(email);
                    if (!user) {
                        console.log('User not found in DB');
                        return null;
                    }
                    console.log('User found:', user.email, 'Role:', user.role);
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('Password match:', passwordsMatch);

                    if (passwordsMatch) return user;
                } else {
                    console.log('Validation failed:', parsedCredentials.error);
                }

                console.log('Invalid credentials - Final return');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log('JWT Callback: User logged in', user.email);
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            console.log('Session Callback: Creating session for', session.user.email);
            if (token && session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: "f4d4a8e2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
});
