import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";
import { CreatePromptDTO } from "./create-prompt.dto";

export class CreatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: CreatePromptDTO): Promise<void> {
    const existingPrompt = await this.promptRepository.findByTitle(data.title);

    if (existingPrompt) {
      throw new Error("Prompt already exists.");
    }

    await this.promptRepository.create(data);
  }
}
