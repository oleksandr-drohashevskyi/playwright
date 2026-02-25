import { test as base } from "@playwright/test";
import { GaragePage } from "../../pages/GaragePage.js";

export const test = base.extend({
  // Фикстура отдаёт готовую GaragePage
  userGaragePage: async ({ browser }, use) => {
    // используем сохранённый storageState
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });

    const page = await context.newPage();

    // sessionStorage = "Hello world"
    await page.addInitScript(() => {
      sessionStorage.setItem("hello", "Hello world");
    });

    const garagePage = new GaragePage(page);
    await garagePage.openDirect();

    await use(garagePage);

    await context.close();
  },
});