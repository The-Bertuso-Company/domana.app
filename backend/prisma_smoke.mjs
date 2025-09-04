import dotenv from "dotenv";
dotenv.config({ path: "C:/Users/Sage/domana/backend/.env", override: true });
console.log("DATABASE_URL =", process.env.DATABASE_URL);

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("prisma ok");
} catch (e) {
  console.error("prisma FAIL:", e?.message || e);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
