import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret-change-me",
  RATE_MAX: Number(process.env.RATE_MAX ?? 100),
  RATE_WINDOW: Number(process.env.RATE_WINDOW ?? 60000)
};
