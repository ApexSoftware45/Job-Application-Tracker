"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Prisma Client is the typed database helper generated from prisma/schema.prisma.
// Controllers import this single instance whenever they need to read or write PostgreSQL data.
const prisma = new client_1.PrismaClient();
exports.default = prisma;
