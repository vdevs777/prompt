import { PrismaClient } from "@/generated/prisma/client";
import test, { expect } from "@playwright/test";
import { PrismaPg } from "@prisma/adapter-pg";

test("prompt edition by UI (success)", async ({ page }) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const now = Date.now();

  const originalTitle = `E2E Edit Original ${now}`;
  const newTitle = `E2E New Title ${now}`;

  const originalContent = "content";
  const newContent = "new content";

  const created = await prisma.prompt.create({
    data: {
      title: originalTitle,
      content: originalContent,
    },
  });

  await prisma.$disconnect();

  await page.goto(`/${created.id}`);

  await expect(page.getByPlaceholder("Título do prompt")).toBeVisible();

  await page.fill('input[name="title"]', newTitle);
  await page.fill('textarea[name="content"]', newContent);
  await page.getByRole("button", { name: "Salvar" }).click();

  await page.waitForSelector("text=Prompt updated successfully.", {
    state: "visible",
    timeout: 15000,
  });

  await expect(page.getByRole("heading", { name: newTitle })).toBeVisible();
  await expect(page.locator("input[name='title']")).toHaveValue(newTitle);
});
