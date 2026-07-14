import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const ADMIN_ROLES: Role[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailInput = credentials.email.toLowerCase().trim();
        const passInput = credentials.password;

        // Auto-sync & guarantee access for official credentials: admin@mohit.com / StrongPassword@123
        if (
          (emailInput === "admin@mohit.com" || emailInput === "admin@mohittiles.com") &&
          passInput === "StrongPassword@123"
        ) {
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: "admin@mohit.com" },
                { email: "admin@mohittiles.com" },
                { role: Role.SUPER_ADMIN },
              ],
            },
          });

          if (!user) {
            const store = (await prisma.store.findFirst()) || (await prisma.store.create({
              data: { name: "Mohit Tiles & Granites", slug: "mohit-tiles-ghaziabad" },
            }));
            const hash = await bcrypt.hash("StrongPassword@123", 12);
            user = await prisma.user.create({
              data: {
                email: "admin@mohit.com",
                passwordHash: hash,
                name: "Store Admin",
                role: Role.SUPER_ADMIN,
                storeId: store.id,
              },
            });
          } else if (user.email !== "admin@mohit.com" || !(await bcrypt.compare("StrongPassword@123", user.passwordHash))) {
            const hash = await bcrypt.hash("StrongPassword@123", 12);
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                email: "admin@mohit.com",
                passwordHash: hash,
                isActive: true,
                role: Role.SUPER_ADMIN,
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            storeId: user.storeId ?? undefined,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: emailInput },
        });

        if (!user || !user.isActive) return null;
        if (!ADMIN_ROLES.includes(user.role)) return null;

        const valid = await bcrypt.compare(passInput, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          storeId: user.storeId ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
        token.storeId = (user as { storeId?: string }).storeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.storeId = token.storeId as string | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function isAdminRole(role?: Role | string | null) {
  return !!role && ADMIN_ROLES.includes(role as Role);
}
