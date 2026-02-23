// pages/HomePage.js
import { expect } from "@playwright/test";

export class HomePage {
  constructor(page) {
    this.page = page;

    this.signUpBtn = page.locator(".hero-descriptor_btn"); // contains "Sign up"
  }

  async open() {
    await this.page.goto("/");
  }

  async openRegistration() {
    await this.signUpBtn.filter({ hasText: "Sign up" }).click();
  }

  async openLogin() {
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }

  async logout() {
    await this.page.getByText("Log out").click();
  }

  async shouldBeLoggedIn() {
    await expect(this.page.getByText("Log out")).toBeVisible();
  }

  async shouldBeLoggedOut() {
    await expect(this.page.getByText("Sign In")).toBeVisible();
  }
}
