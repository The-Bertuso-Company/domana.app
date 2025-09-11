/* merge_service.ts — thin client for SQL merge_listings() */
import { Client } from "pg";
export async function mergeListings(conn: string, a: string, b: string, actor = "system") {
  const c = new Client({ connectionString: conn });
  await c.connect();
  const r = await c.query("SELECT merge_listings($1,$2,$3) AS canonical", [a,b,actor]);
  await c.end();
  return r.rows[0].canonical as string;
}
