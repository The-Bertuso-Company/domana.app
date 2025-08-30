import "dotenv/config";
import { Pool, PoolClient, QueryResult } from "pg";

const url = process.env.DATABASE_URL || "";
const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false }, // Supabase + corp TLS safe
});

const cryptoKey = process.env.APP_CRYPTO_KEY ?? "";

pool.on("connect", (client: PoolClient) => {
  client.query("SET application_name = $1", ["domana-api"]).catch(()=>{});
  if (cryptoKey) {
    client.query("SET app.crypto_key = $1", [cryptoKey]).catch(e=>{
      console.error("SET app.crypto_key failed:", e.message);
    });
  }
});

export async function sql<T=any>(text: string, params: any[] = []): Promise<T[]> {
  const r: QueryResult = await pool.query(text, params);
  return r.rows as T[];
}
export { pool };
