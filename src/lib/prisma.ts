import { copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

function configureVercelSqlite() {
  if (!process.env.VERCEL) return;

  const configuredUrl = process.env.DATABASE_URL;
  if (configuredUrl && !configuredUrl.startsWith("file:")) return;

  const targetPath = join(tmpdir(), "gfs-variemix.db");
  const sourcePath = join(process.cwd(), "prisma", "deploy.db");

  if (!existsSync(targetPath) && existsSync(sourcePath)) {
    copyFileSync(sourcePath, targetPath);
  }

  process.env.DATABASE_URL = `file:${targetPath.replace(/\\/g, "/")}`;
}

configureVercelSqlite();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
