// utils/env.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function loadEnv() {
  const envName = process.env.ENV || "staging";
  const envFile = `.env.${envName}`;

  const fullPath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Env file not found: ${envFile}`);
  }

  dotenv.config({ path: fullPath });

  return envName;
}

export function getEnv() {
  if (!process.env.BASE_URL) loadEnv();

  const required = ["BASE_URL", "HTTP_USER", "HTTP_PASS"];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing env var: ${key}`);
    }
  }

  return {
    BASE_URL: process.env.BASE_URL,
    HTTP_USER: process.env.HTTP_USER,
    HTTP_PASS: process.env.HTTP_PASS,
  };
}