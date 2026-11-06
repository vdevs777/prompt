import { PrismaClient } from "@/generated/prisma/client";
import test, { expect } from "@playwright/test";
import { PrismaPg } from "@prisma/adapter-pg";

test.describe("Prompt search on Sidebar", () => {
  test("filters the list in real time based on the search term", async ({
    page,
  }) => {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    const prisma = new PrismaClient({ adapter });

    const uniqueAlpha = `E2E Search Alpha ${Date.now()}`;
    const uniqueBeta = `E2E Search Beta ${Date.now()}`;

    await prisma.prompt.createMany({
      data: [
        { title: uniqueAlpha, content: "Alpha content" },
        { title: uniqueBeta, content: "Beta content" },
      ],
    });

    await prisma.$disconnect();

    await page.goto("/");

    const searchInput = page.getByPlaceholder("Buscar prompts...");
    await expect(searchInput).toBeVisible();

    await searchInput.fill(uniqueAlpha);
    await expect(page.getByText(uniqueAlpha)).toHaveCount(1);

    await searchInput.fill(uniqueBeta);
    await expect(page.getByText(uniqueBeta)).toHaveCount(1);

    const noExisting = `E2E Search No Existing ${Date.now()}`;
    await searchInput.fill(noExisting);
    await expect(page.getByText(noExisting)).toHaveCount(0);
  });
});
