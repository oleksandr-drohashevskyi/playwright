// pages/modals/LoginModal.js
import { expect } from "@playwright/test";

export class LoginModal {
  constructor(page) {
    this.page = page;

    this.header = page.locator(".modal-header");
    this.email = page.locator("#signinEmail");
    this.password = page.locator("#signinPassword");
    this.loginBtn = page.getByRole("button", { name: "Login" });
  }

  async shouldBeOpened() {
    await expect(this.header).toContainText("Log in");
  }

  async fill(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
  }

  async submit() {
    await this.loginBtn.click();
  }
}
