// pages/modals/RegistrationModal.js
import { expect } from "@playwright/test";

export class RegistrationModal {
  constructor(page) {
    this.page = page;

    this.header = page.locator(".modal-header");
    this.invalid = page.locator(".invalid-feedback");

    this.name = page.locator("#signupName");
    this.lastName = page.locator("#signupLastName");
    this.email = page.locator("#signupEmail");
    this.password = page.locator("#signupPassword");
    this.repeatPassword = page.locator("#signupRepeatPassword");

    this.registerBtn = page.getByRole("button", { name: "Register" });

    this.invalidBorderColor = "rgb(220, 53, 69)";
  }

  async shouldBeOpened() {
    await expect(this.header).toContainText("Registration");
  }

  async registerShouldBeDisabled() {
    await expect(this.registerBtn).toBeDisabled();
  }

  async registerShouldBeEnabled() {
    await expect(this.registerBtn).toBeEnabled();
  }

  async clickRegister() {
    await this.registerBtn.click();
  }

  // ---------- low-level helpers ----------
  async focusBlur(locator) {
    await locator.focus();
    await locator.blur();
  }

  async typeAndBlur(locator, value) {
    await locator.fill(String(value));
    await this.focusBlur(locator);
  }

  async shouldShowError(message) {
    await expect(this.invalid.filter({ hasText: message }).first()).toBeVisible();
  }

  async shouldHaveRedBorder(locator) {
    await expect(locator).toHaveCSS("border-color", this.invalidBorderColor);
  }

  // ---------- assertions ----------
  async assertRequired(locator, msg) {
    await this.focusBlur(locator);
    await this.shouldShowError(msg);
    await this.shouldHaveRedBorder(locator);
  }

  async assertInvalid(locator, value, msg) {
    await this.typeAndBlur(locator, value);
    await this.shouldShowError(msg);
    await this.shouldHaveRedBorder(locator);
  }

  // ---------- form fill ----------
  async fillName(value) {
    await this.typeAndBlur(this.name, value);
  }

  async fillLastName(value) {
    await this.typeAndBlur(this.lastName, value);
  }

  async fillEmail(value) {
    await this.typeAndBlur(this.email, value);
  }

  async fillPassword(value) {
    await this.typeAndBlur(this.password, value);
  }

  async fillRepeatPassword(value) {
    await this.typeAndBlur(this.repeatPassword, value);
  }

  async fillValidForm(user) {
    await this.fillName(user.firstName);
    await this.fillLastName(user.lastName);
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.fillRepeatPassword(user.password);
  }
}