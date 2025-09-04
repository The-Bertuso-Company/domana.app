import "dotenv/config";
import { Pool, PoolClient, QueryResult } from "pg";

const url = process.env.DATABASE_URL || "";
const sslNoVerify =
  process.env.PGSSL_NO_VERIFY === "1" ||
  process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ||
  url.includes("supabase.co");

export const pool = new Pool({
  connectionString: url,
  ssl: sslNoVerify ? { rejectUnauthorized: false } : undefined,
});

export async function sql<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const r: QueryResult = await pool.query(text, params);
  return r.rows as T[];
}
