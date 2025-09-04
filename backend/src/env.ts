import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

/** ESM-safe __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/** Always load backend/.env regardless of CWD */
const ENV_PATH = path.resolve(__dirname, "../.env");
if (!fs.existsSync(ENV_PATH)) {
  console.warn("[env] backend/.env not found at", ENV_PATH);
}
dotenv.config({ path: ENV_PATH, override: true });

/** Log length only (no secrets) to verify which .env loaded */
console.log("[env] loaded", ENV_PATH, "DATABASE_URL length:", (process.env.DATABASE_URL || "").length);

export const requireEnv = (key: string) => {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env ${key}`);
  return v;
};
