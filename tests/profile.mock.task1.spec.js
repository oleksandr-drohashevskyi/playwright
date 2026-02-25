import { expect } from "@playwright/test";
import { test as base } from "@playwright/test";

// Используем уже залогиненное состояние (storageState)
const test = base.extend({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: ".auth/user.json" });
    await use(context);
    await context.close();
  },
});

test("Profile: mock /api/users/profile response and verify UI", async ({ context }) => {
  const page = await context.newPage();

  const mockedProfile = {
    status: "ok",
    data: {
      userId: 1,
      photoFilename: null,
      name: "Oleksandr",
      lastName: "Mocked",
    },
  };

  // Перехватываем именно profile запрос
  await page.route("**/api/users/profile", async (route) => {
    const resp = await route.fetch(); // взять оригинальный ответ (headers/status)
    const json = await resp.json();

    // Подменяем только нужные поля, остальное оставляем как было
    const patched = {
      ...json,
      data: {
        ...json.data,
        name: mockedProfile.data.name,
        lastName: mockedProfile.data.lastName,
      },
    };

    await route.fulfill({
      status: resp.status(),
      headers: resp.headers(),
      contentType: "application/json",
      body: JSON.stringify(patched),
    });
  });

  await page.goto("/panel/profile");

  // UI показывает имя/фамилию крупным текстом
  await expect(page.getByRole("heading", { level: 1, name: "Profile" })).toBeVisible();

  // На странице есть большое отображение имени (как на скрине)
  await expect(page.getByText(`${mockedProfile.data.name} ${mockedProfile.data.lastName}`)).toBeVisible();
});