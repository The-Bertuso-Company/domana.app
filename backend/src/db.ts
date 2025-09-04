import "./env";
import net from "node:net";
import { PrismaClient } from "@prisma/client";

console.log("[db] urlLen:", (process.env.DATABASE_URL ?? "").length);

// Simple TCP probe so we can see from THIS process whether localhost:5432 is reachable
async function tcpProbe(host: string, port: number, ms = 2000) {
  return await new Promise<boolean>((resolve) => {
    const s = net.connect({ host, port }, () => {
      console.log(`[db] tcp OK ${host}:${port}`);
      s.destroy();
      resolve(true);
    });
    s.on("error", (e) => {
      console.error(`[db] tcp FAIL ${host}:${port} -> ${e.message}`);
      resolve(false);
    });
    setTimeout(() => {
      console.error(`[db] tcp TIMEOUT ${host}:${port}`);
      try { s.destroy(); } catch {}
      resolve(false);
    }, ms);
  });
}

await tcpProbe("127.0.0.1", 5432);

export const prisma = new PrismaClient();
