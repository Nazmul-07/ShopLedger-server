import "dotenv/config";
import * as Prisma from "@prisma/client";

const PrismaClient = (Prisma as any).PrismaClient;

const prisma = new PrismaClient();

export { prisma };