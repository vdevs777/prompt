import { expect, test } from "@playwright/test";

test("should load home page", async ({ page }) => {
  await page.goto("/");

  expect(
    page.getByRole("heading", { name: "Selecione um prompt" })
  ).toBeVisible();

  expect(
    page.getByText(
      "Escolha um prompt da lista ao lado para visualizar e editar"
    )
  ).toBeVisible();
});
