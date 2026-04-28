import path from "node:path";
import { config } from "dotenv";
import type { SignOptions } from "jsonwebtoken";

config({ path: path.resolve(process.cwd(), "src/.env") });

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing in .env`);
  }

  return value;
};

const getJwtExpiresEnv = (name: string): SignOptions["expiresIn"] => {
  const value = getRequiredEnv(name);
  const validFormat = /^\d+(ms|s|m|h|d|w|y)$/.test(value);

  if (!validFormat) {
    throw new Error(`${name} must be like 15m, 7d, 1h, or 30s`);
  }

  return value as SignOptions["expiresIn"];
};

export const env = {
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  ACCESS_TOKEN_SECRET: getRequiredEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getRequiredEnv("REFRESH_TOKEN_SECRET"),
  ACCESS_EXPIRES: getJwtExpiresEnv("ACCESS_EXPIRES"),
  REFRESH_EXPIRES: getJwtExpiresEnv("REFRESH_EXPIRES"),
};
