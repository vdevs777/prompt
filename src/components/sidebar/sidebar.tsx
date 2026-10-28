import { prisma } from "@/lib/prisma";
import { SidebarContent } from "./sidebar-content";
import { PrismaPromptRepository } from "@/infra/repositories/prisma-prompt-repository";
import { PromptSummary } from "@/core/domain/prompts/entities/prompt";

export async function Sidebar() {
  const repository = new PrismaPromptRepository(prisma);

  let initialPrompts: PromptSummary[] = [];

  try {
    const prompts = await repository.findMany();
    initialPrompts = prompts;
  } catch {
    initialPrompts = [];
  }

  return <SidebarContent prompts={initialPrompts} />;
}
