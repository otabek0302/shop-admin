import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";

import type { AuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email.toLowerCase() },
                });

                if (!user) {
                    console.log("❌ No user found with email:", credentials.email);
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    console.log("❌ Invalid password for:", credentials.email);
                    return null;
                }

                console.log("✅ Logged in:", user.email);
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            // When user logs in for the first time
            if (user) {
                token.role = (user as User).role;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (session.user && token.role) {
                session.user.role = token.role as string;
            }

            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    // You can enable debug logging for local dev if needed:
    debug: process.env.NODE_ENV === "development",
};

export const getSession = async () => {
    return await getServerSession(authOptions);
};