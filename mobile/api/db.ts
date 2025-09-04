// C:\Users\Sage\domana\mobile\api\db.ts
import { Pool } from "pg";

/** Local-friendly defaults; env wins if set */
export const pool = new Pool({
  host: process.env.PGHOST || "127.0.0.1",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "domana",
  password: process.env.PGPASSWORD || "domana",
  database: process.env.PGDATABASE || "domanadev",
  application_name: "domana-api",
});

// No custom SETs here — we pass crypto key as a SQL parameter where needed.
