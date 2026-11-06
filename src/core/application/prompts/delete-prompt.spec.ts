import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";
import { DeletePromptUseCase } from "./delete-prompt";

function makeRepository(overrides: Partial<PromptRepository>) {
  const base = {
    delete: jest.fn(async () => {}),
    findById: jest.fn(async () => {}),
  };

  return { ...base, ...overrides } as PromptRepository;
}

describe("Use Case: Delete Prompt", () => {
  it("should delete a prompt when it exists", async () => {
    const now = new Date();

    const prompt = {
      id: "1",
      title: "title",
      content: "content",
      createdAt: now,
      updatedAt: now,
    };

    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(prompt),
      delete: jest.fn().mockResolvedValue(undefined),
    });

    const useCase = new DeletePromptUseCase(repository);
    const result = await useCase.execute(prompt.id);

    expect(result).toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(prompt.id);
  });

  it("should fail if prompt does not exist", async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = new DeletePromptUseCase(repository);

    expect(useCase.execute("1")).rejects.toThrow("Prompt not found.");
  });
});
