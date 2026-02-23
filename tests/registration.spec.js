import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage.js";
import { RegistrationModal } from "../pages/modals/RegistrationModal.js";
import { LoginModal } from "../pages/modals/LoginModal.js";
import { makeUniqueUser } from "../utils/user.factory.js";

test.describe("Registration - validation (POM)", () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.openRegistration();

    const reg = new RegistrationModal(page);
    await reg.shouldBeOpened();
  });

  test("Required fields: messages + red border + Register disabled", async ({ page }) => {
    const reg = new RegistrationModal(page);

    const fields = [
      { locator: reg.name, msg: "Name required" },
      { locator: reg.lastName, msg: "Last name required" },
      { locator: reg.email, msg: "Email required" },
      { locator: reg.password, msg: "Password required" },
      { locator: reg.repeatPassword, msg: "Re-enter password required" },
    ];

    for (const f of fields) {
      await reg.assertRequired(f.locator, f.msg);
      await reg.registerShouldBeDisabled();
    }
  });

  test("Name validation: length + invalid symbols", async ({ page }) => {
    const reg = new RegistrationModal(page);

    await reg.assertInvalid(reg.name, "A", "Name has to be from 2 to 20 characters long");
    await reg.assertInvalid(reg.name, "A".repeat(21), "Name has to be from 2 to 20 characters long");
    await reg.assertInvalid(reg.name, "Іван", "Name is invalid");

    await reg.registerShouldBeDisabled();
  });

  test("Last name validation: length + invalid symbols", async ({ page }) => {
    const reg = new RegistrationModal(page);

    await reg.assertInvalid(reg.lastName, "B", "Last name has to be from 2 to 20 characters long");
    await reg.assertInvalid(reg.lastName, "B".repeat(21), "Last name has to be from 2 to 20 characters long");
    await reg.assertInvalid(reg.lastName, "Петренko", "Last name is invalid");

    await reg.registerShouldBeDisabled();
  });

  test("Email validation", async ({ page }) => {
    const reg = new RegistrationModal(page);

    await reg.assertInvalid(reg.email, "not-an-email", "Email is incorrect");
    await reg.assertInvalid(reg.email, "a@a", "Email is incorrect");

    await reg.registerShouldBeDisabled();
  });

  test("Password rules: 8..15 + digit + upper + lower", async ({ page }) => {
    const reg = new RegistrationModal(page);

    const msg =
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter";

    await reg.assertInvalid(reg.password, "Abc1def", msg); // 7 chars
    await reg.assertInvalid(reg.password, "Abcdefgh", msg); // no digit
    await reg.assertInvalid(reg.password, "abcdefg1", msg); // no upper
    await reg.assertInvalid(reg.password, "ABCDEFG1", msg); // no lower
    await reg.assertInvalid(reg.password, "Abcdefghijklmno1", msg); // 16 chars

    await reg.registerShouldBeDisabled();
  });

  test("Repeat password mismatch", async ({ page }) => {
    const reg = new RegistrationModal(page);

    await reg.fillPassword("Abcdefg1");
    await reg.assertInvalid(reg.repeatPassword, "Abcdefg2", "Passwords do not match");

    await reg.registerShouldBeDisabled();
  });
});

test.describe.serial("Registration - E2E (POM)", () => {
  let createdUser;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
  });

  test("Open registration modal", async ({ page }) => {
    const home = new HomePage(page);
    const reg = new RegistrationModal(page);

    await home.openRegistration();
    await reg.shouldBeOpened();
  });

  test("Happy path: register new user -> logout", async ({ page }) => {
    const home = new HomePage(page);
    const reg = new RegistrationModal(page);

    await home.openRegistration();
    await reg.shouldBeOpened();

    createdUser = makeUniqueUser();
    await reg.fillValidForm(createdUser);

    await reg.registerShouldBeEnabled();
    await reg.clickRegister();

    await home.shouldBeLoggedIn();

    await home.logout();
    await home.shouldBeLoggedOut();
  });

  test("Login with created user", async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginModal(page);

    expect(createdUser, "createdUser should be set by previous test").toBeTruthy();

    await home.openLogin();
    await login.shouldBeOpened();

    await login.fill(createdUser.email, createdUser.password);
    await login.submit();

    await home.shouldBeLoggedIn();
  });
});