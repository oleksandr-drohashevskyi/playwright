import { expect } from "@playwright/test";
import { test } from "./fixtures/userGaragePage.js";

test("userGaragePage fixture: user is logged in + sessionStorage hello", async ({ userGaragePage }) => {
  // проверка, что мы реально залогинены
  await expect(userGaragePage.page.getByText("Log out")).toBeVisible();

  // проверка sessionStorage "Hello world"
  const value = await userGaragePage.page.evaluate(() => sessionStorage.getItem("hello"));
  expect(value).toBe("Hello world");

  // любая минимальная проверка гаража
  await expect(userGaragePage.page).toHaveURL(/\/panel\/garage/);
});