
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const REQUIRED_KEYS = /** @type {const} */ (["BASE_URL", "HTTP_USER", "HTTP_PASS"]);

/** @returns {boolean} */
function hasAllRequiredEnv() {
  return REQUIRED_KEYS.every((k) => Boolean(process.env[k]));
}

/**
 * Load .env.<ENV> only if required vars are not already provided by the environment.
 * - In CI we usually pass vars via GitHub Secrets → file is NOT needed.
 * - Locally we load from .env.staging/.env.prod.
 * @returns {void}
 */
export function loadEnv() {
  // ✅ If secrets/vars already exist (CI), do nothing
  if (hasAllRequiredEnv()) return;

  /** @type {string} */
  const envName = process.env.ENV ?? "staging";
  const envFile = `.env.${envName}`;
  const fullPath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Env file not found: ${envFile}. Provide env vars (${REQUIRED_KEYS.join(
        ", "
      )}) or create ${envFile}`
    );
  }

  dotenv.config({ path: fullPath });
}

/**
 * @returns {{ BASE_URL: string, HTTP_USER: string, HTTP_PASS: string }}
 */
export function getEnv() {
  loadEnv();

  for (const key of REQUIRED_KEYS) {
    const value = process.env[key];
    if (!value) throw new Error(`Missing env var: ${key}`);
  }

  return {
    BASE_URL: process.env.BASE_URL,
    HTTP_USER: process.env.HTTP_USER,
    HTTP_PASS: process.env.HTTP_PASS,
  };
}