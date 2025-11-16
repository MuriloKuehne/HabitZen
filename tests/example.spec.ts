import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/HabitZen/);
  await expect(page.getByRole("heading", { name: "HabitZen" })).toBeVisible();
});

test("can navigate to login", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/.*login/);
});

test("can navigate to register", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Criar Conta" }).click();
  await expect(page).toHaveURL(/.*register/);
});

