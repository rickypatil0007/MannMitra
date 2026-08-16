import { PrismaClient, Prisma } from "@/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalForPrisma = global as unknown as { prisma: any };

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  }).$extends(fieldEncryptionExtension({ dmmf: Prisma.dmmf }));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
