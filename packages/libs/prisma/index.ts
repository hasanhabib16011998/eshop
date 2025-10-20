import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid eslint/no-var, and allow reuse across hot reloads
  // eslint-disable-next-line no-var
  var prismadb: PrismaClient | undefined;
}

const prisma = global.prismadb ?? new PrismaClient();

// In development we attach to globalThis to avoid creating multiple instances
if (process.env.NODE_ENV !== "production") {
  global.prismadb = prisma;
}

export default prisma;