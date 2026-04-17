import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        session.user.role = (token.role as string) || 'USER';
        session.user.organizationId = token.organizationId as string || '';
        session.user.organizationRole = token.organizationRole as string || 'MEMBER';
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.organizationRole = user.organizationRole;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Optionally auto-create org for first user
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email! },
          include: { organizations: { take: 1 } },
        });

        if (!existingUser?.organizations.length) {
          // Create personal org
          const org = await prisma.organization.create({
            data: {
              name: `${user.name}'s Workspace`,
              slug: `workspace-${user.email?.split("@")[0]}`,
            },
          });
          await prisma.organizationMember.create({
            data: {
              organizationId: org.id,
              userId: user.id,
              role: "OWNER",
            },
          });
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
