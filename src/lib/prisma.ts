// lib/prisma.ts
// Prisma client singleton - works even without database connected

let prisma: any;

try {
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = global as unknown as { prisma: any };

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: ["error"],
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (e) {
  // Prisma not available yet - database features will be enabled in Phase 2
  prisma = null;
}

export { prisma };