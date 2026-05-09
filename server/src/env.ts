import path from "node:path";
import { config } from "dotenv";
import type { SignOptions } from "jsonwebtoken";

config({ path: path.resolve(process.cwd(), ".env") });
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

const getOptionalNumberEnv = (name: string, fallback: number) => {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${name} must be a number`);
  }

  return parsedValue;
};

const getCsvEnv = (name: string) => {
  return getRequiredEnv(name)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

export const env = {
  PORT: getOptionalNumberEnv("PORT", 5000),
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  CLIENT_URL: getRequiredEnv("CLIENT_URL"),
  CORS_ORIGINS: getCsvEnv("CORS_ORIGINS"),
  ACCESS_TOKEN_SECRET: getRequiredEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: getRequiredEnv("REFRESH_TOKEN_SECRET"),
  ACCESS_EXPIRES: getJwtExpiresEnv("ACCESS_EXPIRES"),
  REFRESH_EXPIRES: getJwtExpiresEnv("REFRESH_EXPIRES"),
};
