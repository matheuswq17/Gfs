import { PrismaClient } from "@prisma/client";

function normalizeEnvUrl(name: "DATABASE_URL" | "DIRECT_URL") {
  const value = process.env[name];
  if (!value) return;

  let trimmed = value.trim();
  const assignmentPrefix = `${name}=`;

  if (trimmed.startsWith(assignmentPrefix)) {
    trimmed = trimmed.slice(assignmentPrefix.length).trim();
  }

  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");

  process.env[name] = hasDoubleQuotes || hasSingleQuotes ? trimmed.slice(1, -1) : trimmed;
}

normalizeEnvUrl("DATABASE_URL");
normalizeEnvUrl("DIRECT_URL");

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
