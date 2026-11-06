import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";
import { UpdatePromptDTO } from "./update-prompt.dto";

export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDTO) {
    const exists = await this.promptRepository.findById(data.id);
    if (!exists) {
      throw new Error("Prompt not found.");
    }

    return this.promptRepository.update(data.id, {
      title: data.title,
      content: data.content,
    });
  }
}
