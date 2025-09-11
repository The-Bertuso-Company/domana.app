require("dotenv").config({ path: "C:/Users/Sage/domanA/backend/.env", override: true });
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("prisma ok");
  } catch (e) {
    console.error("prisma FAIL:", e.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
