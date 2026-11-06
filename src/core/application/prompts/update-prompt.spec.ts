import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";
import { UpdatePromptUseCase } from "./update-prompt";
import { UpdatePromptDTO } from "./update-prompt.dto";

const makeRepository = (overrides: Partial<PromptRepository>) => {
  const base = {
    update: jest.fn(async (id, data) => ({
      id,
      title: data.title ?? "",
      content: data.content ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findById: jest.fn(async () => null),
  };

  return { ...base, ...overrides } as PromptRepository;
};

describe("Use Case: Update Prompt", () => {
  it("should update a prompt when it exists", async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue({
        id: "1",
        title: "old Title",
        content: "old Content",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: jest.fn().mockResolvedValue({
        id: "1",
        title: "new Title",
        content: "new Content",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    const useCase = new UpdatePromptUseCase(repository);

    const input: UpdatePromptDTO = {
      id: "1",
      title: "new Title",
      content: "new Content",
    };

    const result = await useCase.execute(input);

    expect(result.title).toBe(input.title);
    expect(repository.update).toHaveBeenCalledWith(input.id, {
      title: input.title,
      content: input.content,
    });
  });

  it("should not update a prompt when it does not exist", async () => {
    const repository = makeRepository({
      findById: jest.fn().mockResolvedValue(null),
    });

    const useCase = new UpdatePromptUseCase(repository);

    const input: UpdatePromptDTO = {
      id: "1",
      title: "it's supposed to fail",
      content: "it's supposed to fail",
    };

    await expect(useCase.execute(input)).rejects.toThrow("Prompt not found.");
  });
});
