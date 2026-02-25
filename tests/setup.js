
import { test, expect } from "@playwright/test";
import { getEnv } from "../utils/env.js";

test("auth setup: login and save storage state", async ({ page }) => {
  const env = getEnv();

  await page.goto("/");

  // open login modal
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.locator(".modal-header")).toContainText("Log in");

  // credentials (prefer env.js, but allow plain process.env)
  const email = env.USER_EMAIL || process.env.USER_EMAIL;
  const password = env.USER_PASSWORD || process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing USER_EMAIL / USER_PASSWORD in env (.env.* or GitHub Secrets).");
  }

  await page.locator("#signinEmail").fill(email);
  await page.locator("#signinPassword").fill(password);

  await page.getByRole("button", { name: "Login" }).click();

  // logged-in marker
  await expect(page.getByText("Log out")).toBeVisible();

  // save auth
  await page.context().storageState({ path: ".auth/user.json" });
});