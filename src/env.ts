@'
export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/domana",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379"
};
'@ | Set-Content -Encoding UTF8 src\env.ts
