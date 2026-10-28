import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";
import { CreatePromptUseCase } from "./create-prompt";

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    create: jest.fn(async () => undefined),
  };

  return { ...base, ...overrides } as PromptRepository;
};

describe("Use Case: Create Prompt", () => {
  it("should create a prompt when there is no duplicity", async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue(null),
    });

    const useCase = new CreatePromptUseCase(repository);
    const input = {
      title: "novo",
      content: "content",
    };

    await expect(useCase.execute(input)).resolves.toBeUndefined();

    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it("should fail with 'prompt already exists' when there is already a prompt with the inputed title", async () => {
    const repository = makeRepository({
      findByTitle: jest.fn().mockResolvedValue({
        id: "id",
        title: "novo",
        content: "content",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    const useCase = new CreatePromptUseCase(repository);
    const input = {
      title: "novo",
      content: "content",
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      "Prompt already exists."
    );
  });
});
