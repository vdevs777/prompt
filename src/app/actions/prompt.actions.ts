"use server";

import z from "zod";

import { prisma } from "@/lib/prisma";

import { SearchPromptsUseCase } from "@/core/application/prompts/search-prompts";
import { CreatePromptUseCase } from "@/core/application/prompts/create-prompt";
import { PromptSummary } from "@/core/domain/prompts/entities/prompt";

import {
  CreatePromptDTO,
  createPromptSchema,
} from "@/core/application/prompts/create-prompt.dto";
import {
  UpdatePromptDTO,
  updatePromptSchema,
} from "@/core/application/prompts/update-prompt.dto";

import { PrismaPromptRepository } from "@/infra/repositories/prisma-prompt-repository";
import { UpdatePromptUseCase } from "@/core/application/prompts/update-prompt";
import { DeletePromptUseCase } from "@/core/application/prompts/delete-prompt";
import { revalidatePath } from "next/cache";

type SearchFormState = {
  success: boolean;
  prompts?: PromptSummary[];
  message?: string;
};

type FormState = {
  success: boolean;
  message: string;
  prompts?: PromptSummary[];
  errors?: unknown;
};

export async function createPromptAction(
  data: CreatePromptDTO
): Promise<FormState> {
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

    revalidatePath("/", "layout");
  } catch (error) {
    const _error = error as Error;

    if (_error.message === "Prompt already exists.") {
      return { success: false, message: _error.message };
    }

    return { success: false, message: "Fail on creating prompt." };
  }

  return { success: true, message: "Prompt created successfully." };
}

export async function updatePromptAction(
  data: UpdatePromptDTO
): Promise<FormState> {
  const validated = updatePromptSchema.safeParse(data);

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
    const useCase = new UpdatePromptUseCase(repository);
    await useCase.execute(validated.data);

    revalidatePath("/", "layout");

    return { success: true, message: "Prompt updated successfully." };
  } catch (error) {
    const _error = error as Error;

    if (_error.message === "Prompt not found.") {
      return { success: false, message: _error.message };
    }
  }

  return { success: false, message: "Fail on updating prompt." };
}

export async function deletePromptAction(id: string): Promise<FormState> {
  if (!id) return { success: false, message: "Prompt ID is required." };

  try {
    const repository = new PrismaPromptRepository(prisma);
    const useCase = new DeletePromptUseCase(repository);
    await useCase.execute(id);

    revalidatePath("/", "layout");

    return { success: true, message: "Prompt deleted successfully." };
  } catch (error) {
    const _error = error as Error;

    if (_error.message === "Prompt not found.") {
      return { success: false, message: _error.message };
    }

    return { success: false, message: "Fail on deleting prompt." };
  }
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
