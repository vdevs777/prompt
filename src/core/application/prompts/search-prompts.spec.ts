import { PromptRepository } from "@/core/domain/prompts/repositories/prompt-repository";
import { SearchPromptsUseCase } from "./search-prompts";
import { Prompt } from "@/core/domain/prompts/entities/prompt";

describe("Use Case: Search Prompts", () => {
  const input: Prompt[] = [
    {
      id: "1",
      title: "Title 01",
      content: "Content 01",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Title 02",
      content: "Content 02",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const repository: PromptRepository = {
    async findMany() {
      return input;
    },

    async searchMany(term) {
      return input.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(term?.toLowerCase()) ||
          prompt.content.toLowerCase().includes(term?.toLowerCase())
      );
    },

    findByTitle: function (): Promise<Prompt | null> {
      throw new Error("Function not implemented.");
    },

    create: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    findById: function (): Promise<Prompt | null> {
      throw new Error("Function not implemented.");
    },
    update: function (): Promise<Prompt> {
      throw new Error("Function not 'mplemented.");
    },
    delete: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
  };

  it("should return all prompts when search term is empty", async () => {
    const useCase = new SearchPromptsUseCase(repository);

    const results = await useCase.execute("");

    expect(results).toHaveLength(2);
  });

  it("should filter prompt list by search term", async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const query = "title 01";

    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("1");
  });

  it("should apply trim on search terms with blank spaces and return the whole prompt list", async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);

    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = "   ";

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });

  it("should search using a search term with blank spaces and trim them", async () => {
    const firstElement = input.slice(0, 1);

    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue(firstElement);

    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = " title 02  ";

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(searchMany).toHaveBeenCalledWith(query.trim());
    expect(findMany).not.toHaveBeenCalled();
  });

  it("should handle undefined or null search term and return the whole prompt list", async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);

    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = undefined as unknown as string;

    const results = await useCase.execute(query);

    expect(results).toMatchObject(input);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });
});
