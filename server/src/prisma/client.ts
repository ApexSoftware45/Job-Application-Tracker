import { PrismaClient } from "@prisma/client";

// Prisma Client is the typed database helper generated from prisma/schema.prisma.
// Controllers import this single instance whenever they need to read or write PostgreSQL data.
const prisma = new PrismaClient();

export default prisma;
