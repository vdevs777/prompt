import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";

export class DeletePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(id: string) {
    const prompt = await this.promptRepository.findById(id);

    if (!prompt) {
      throw new Error("Prompt not found.");
    }

    await this.promptRepository.delete(id);
  }
}
