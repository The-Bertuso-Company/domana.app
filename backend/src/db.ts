import "./env";
import { PrismaClient } from "@prisma/client";

console.log("[db] urlLen:", (process.env.DATABASE_URL ?? "").length);

export const prisma = new PrismaClient();
