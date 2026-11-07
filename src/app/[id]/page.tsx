import { Suspense } from "react";

import { PromptForm } from "@/components/prompt";
import { PrismaPromptRepository } from "@/infra/repositories/prisma-prompt-repository";
import { prisma } from "@/lib/prisma";

interface PromptPageProps {
  params: Promise<{ id: string }>;
}

export default function PromptPage({ params }: PromptPageProps) {
  return (
    <Suspense fallback={<div>Carregando prompt...</div>}>
      <PromptContent params={params} />
    </Suspense>
  );
}

async function PromptContent({ params }: PromptPageProps) {
  const { id } = await params;

  const repository = new PrismaPromptRepository(prisma);
  const prompt = await repository.findById(id);

  return <PromptForm prompt={prompt} />;
}
