"use server";

import z from "zod";

import { prisma } from "@/lib/prisma";

import { SearchPromptsUseCase } from "@/core/application/prompts/search-prompts";
import { CreatePromptUseCase } from "@/core/application/prompts/create-prompt";
import { PromptSummary } from "@/core/domain/prompts/entities/prompt";
import { PrismaPromptRepository } from "@/infra/repositories/prisma-prompt-repository";
import {
  CreatePromptDTO,
  createPromptSchema,
} from "@/core/application/prompts/create-prompt.dto";

type SearchFormState = {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
};

export async function createPromptAction(data: CreatePromptDTO) {
  const validated = createPromptSchema.safeParse(data);

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);

    return {
      success: false,
      message: "Validation error.",
      errors: fieldErrors,
    };
  }

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new CreatePromptUseCase(repository);

    await useCase.execute(validated.data);
  } catch (error) {
    const _error = error as Error;

    if (_error.message === "Prompt already exists.") {
      return { success: false, message: _error.message };
    }

    return { success: false, message: "Fail on creating prompt." };
  }

  return { success: true, message: "Prompt created successfully." };
}

export async function searchPromptsAction(
  _prev: SearchFormState,
  formData: FormData
): Promise<SearchFormState> {
  const term = String(formData.get("q") ?? "").trim();

  const repository = new PrismaPromptRepository(prisma);
  const useCase = new SearchPromptsUseCase(repository);

  try {
    const results = await useCase.execute(term);

    const summaries = results.map(({ id, title, content }) => ({
      id,
      title,
      content,
    }));

    return {
      success: true,
      prompts: summaries,
    };
  } catch {
    return {
      success: false,
      message: "Fail on searching prompts.",
    };
  }
}
