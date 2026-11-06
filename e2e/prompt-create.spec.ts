import { PrismaClient } from "@/generated/prisma/client";
import { expect, test } from "@playwright/test";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

test("prompt creation by UI (success)", async ({ page }) => {
  const uniqueTitle = `E2E Prompt ${Date.now()}`;
  const content = "Conteúdo gerado via E2E";

  await page.goto("/new");

  await expect(page.getByPlaceholder("Título do prompt")).toBeVisible();

  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="content"]', content);
  await page.getByRole("button", { name: "Salvar" }).click();

  await page.waitForSelector("text=Prompt created successfully.", {
    state: "visible",
    timeout: 15000,
  });
});

test("title duplicity validation", async ({ page }) => {
  const duplicatedTitle = "E2E Duplicated Prompt";
  const content = "Content";

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.prompt.deleteMany({ where: { title: duplicatedTitle } });
  await prisma.prompt.create({ data: { title: duplicatedTitle, content } });
  await prisma.$disconnect();

  await page.goto("/new");

  await expect(page.getByPlaceholder("Título do prompt")).toBeVisible();

  await page.fill('input[name="title"]', duplicatedTitle);
  await page.fill('textarea[name="content"]', content);
  await page.getByRole("button", { name: "Salvar" }).click();

  await page.waitForSelector("text=Prompt already exists.", {
    state: "visible",
    timeout: 15000,
  });

  await expect(
    page.getByRole("heading", { name: duplicatedTitle })
  ).toHaveCount(1);
});
