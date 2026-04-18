// @ts-ignore - PrismaClient may not be fully generated
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

let client: any;

if (process.env.DATABASE_URL) {
  client = globalForPrisma.prisma ?? new (PrismaClient as any)();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
} else {
  // Dummy implementation for demo mode
  client = {
    $connect: async () => {},
    $disconnect: async () => {},
    $on: async () => {},
    $transaction: async () => ({}) as any,
    user: { findFirst: async () => null },
    organization: { create: async () => ({ id: 'demo' }) },
    organizationMember: { create: async () => ({}) },
    repository: { update: async () => ({}) },
    scan: { update: async () => ({ id: 'demo' }) },
    repositoryFile: { findMany: async () => [] },
  } as any;
}

export const prisma = client;
export default client;
