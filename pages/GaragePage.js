import { expect } from "@playwright/test";

export class GaragePage {
  constructor(page) {
    this.page = page;

    this.garageNav = page.getByRole("link", { name: "Garage" });
    this.addCarBtn = page.getByRole("button", { name: "Add car" });

    this.brandSelect = page.locator("#addCarBrand");
    this.modelSelect = page.locator("#addCarModel");
    this.mileageInput = page.locator("#addCarMileage");

    this.modalAddBtn = page.locator(".modal-footer").getByRole("button", { name: "Add" });
    this.carCards = page.locator(".car");
  }

  async openFromNav() {
    await this.garageNav.click();
    await expect(this.page).toHaveURL(/\/panel\/garage/);
  }

  async openDirect() {
    await this.page.goto("/panel/garage");
    await expect(this.page).toHaveURL(/\/panel\/garage/);
  }

  async openAddCarModal() {
    await this.addCarBtn.click();
  }

  async fillCarBrand(brand) {
    await this.brandSelect.selectOption({ label: brand });
  }

  async fillCarModel(model) {
    await this.modelSelect.selectOption({ label: model });
  }

  async fillCarMileage(mileage) {
    await this.mileageInput.fill(String(mileage));
  }

  async submitAddCar() {
    await this.modalAddBtn.click();
  }

  async addCar({ brand, model, mileage }) {
    await this.openDirect();
    await this.openAddCarModal();
    await this.fillCarBrand(brand);
    await this.fillCarModel(model);
    await this.fillCarMileage(mileage);
    await this.submitAddCar();
  }

  async carShouldExist({ brand, model }) {
    await expect(this.carCards.filter({ hasText: brand }).first()).toBeVisible();
    await expect(this.carCards.filter({ hasText: model }).first()).toBeVisible();
  }
}