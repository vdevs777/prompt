import {
  createPromptAction,
  deletePromptAction,
  searchPromptsAction,
  updatePromptAction,
} from "./prompt.actions";

const mockedSearchExecute = jest.fn();
const mockedCreateExecute = jest.fn();
const mockedUpdateExecute = jest.fn();
const mockedDeleteExecute = jest.fn();

jest.mock("@/lib/prisma", () => ({ prisma: {} }));

jest.mock("@/core/application/prompts/search-prompts", () => ({
  SearchPromptsUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedSearchExecute })),
}));

jest.mock("@/core/application/prompts/create-prompt", () => ({
  CreatePromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedCreateExecute })),
}));

jest.mock("@/core/application/prompts/update-prompt", () => ({
  UpdatePromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedUpdateExecute })),
}));

jest.mock("@/core/application/prompts/delete-prompt", () => ({
  DeletePromptUseCase: jest
    .fn()
    .mockImplementation(() => ({ execute: mockedDeleteExecute })),
}));

describe("Server Actions: Prompts", () => {
  beforeEach(() => {
    mockedSearchExecute.mockReset();
    mockedCreateExecute.mockReset();
    mockedUpdateExecute.mockReset();
    mockedDeleteExecute.mockReset();
  });

  describe("createPromptAction", () => {
    it("should create a prompt with success", async () => {
      mockedCreateExecute.mockResolvedValue(undefined);

      const data = {
        title: "Title",
        content: "Content",
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(true);
      expect(result?.message).toBe("Prompt created successfully.");
    });

    it("should return validation error when fields are empty", async () => {
      const data = {
        title: "",
        content: "",
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Validation error.");
      expect(result?.errors).toBeDefined();
    });

    it("should return error when prompt already exists", async () => {
      mockedCreateExecute.mockRejectedValue(
        new Error("Prompt already exists.")
      );

      const data = { title: "duplicado", content: "duplicado" };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Prompt already exists.");
    });

    it("should return generic error when creation fails", async () => {
      mockedCreateExecute.mockRejectedValue(new Error("Unknown error."));

      const data = {
        title: "title",
        content: "content",
      };

      const result = await createPromptAction(data);

      expect(result?.success).toBe(false);
      expect(result?.message).toBe("Fail on creating prompt.");
    });
  });

  describe("updatePromptAction", () => {
    it("should update successfully", async () => {
      mockedUpdateExecute.mockResolvedValue({});

      const promptId = "1";

      const data = { id: promptId, title: "new title", content: "new content" };

      const result = await updatePromptAction(data);

      expect(result).toMatchObject({
        success: true,
        message: "Prompt updated successfully.",
      });
    });

    it("should return validation error when fields are empty", async () => {
      const data = {
        id: "1",
        title: "",
        content: "",
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Validation error.");
      expect(result.errors).toBeDefined();
    });

    it("should return error when prompt does not exist", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("Prompt not found."));

      const promptId = "1";

      const data = {
        id: promptId,
        title: "Novo",
        content: "Novo",
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Prompt not found.");
    });

    it("should return generic error when update fails", async () => {
      mockedUpdateExecute.mockRejectedValue(new Error("Unknown error."));

      const promptId = "1";

      const data = {
        id: promptId,
        title: "Novo",
        content: "Novo",
      };

      const result = await updatePromptAction(data);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Fail on updating prompt.");
    });
  });

  describe("deletePromptAction", () => {
    it("should delete successfully", async () => {
      mockedDeleteExecute.mockResolvedValue(undefined);

      const promptId = "1";

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Prompt deleted successfully.");
    });

    it("should return error when id is empty", async () => {
      const promptId = "";

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Prompt ID is required.");
    });

    it("should return error when prompt does not exist", async () => {
      const errorMessage = "Prompt not found.";

      mockedDeleteExecute.mockRejectedValue(new Error(errorMessage));

      const promptId = "1";

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
    });

    it("should return generic error when action fails", async () => {
      mockedDeleteExecute.mockRejectedValue(new Error("Unknown error."));

      const promptId = "1";

      const result = await deletePromptAction(promptId);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Fail on deleting prompt.");
    });
  });

  describe("searchPromptsAction", () => {
    it("should return success using a non-empty search term", async () => {
      const input = [{ id: "1", title: "AI Title", content: "Content" }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append("q", "AI");

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it("should return success and list all prompts using an empty search term", async () => {
      const input = [
        { id: "1", title: "Title 1", content: "Content 1" },
        { id: "2", title: "Title 2", content: "Content 2" },
      ];

      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append("q", "");

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it("should return a generic error if the search fails", async () => {
      const error = new Error("Unknown");
      mockedSearchExecute.mockRejectedValue(error);

      const formData = new FormData();
      formData.append("q", "error");

      const result = await searchPromptsAction({ success: true }, formData);

      expect(result.success).toBe(false);
      expect(result.prompts).toBeUndefined();
      expect(result.message).toBe("Fail on searching prompts.");
    });

    it("should trim spaces of the search term before searching", async () => {
      const input = [{ id: "1", title: "Title 1", content: "Content 1" }];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();
      formData.append("q", "    Title 1  ");

      const result = await searchPromptsAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith("Title 1");
      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });

    it("should treat empty query as empty search term", async () => {
      const input = [
        { id: "1", title: "Title 1", content: "Content 1" },
        { id: "2", title: "Title 2", content: "Content 2" },
      ];
      mockedSearchExecute.mockResolvedValue(input);

      const formData = new FormData();

      const result = await searchPromptsAction({ success: true }, formData);

      expect(mockedSearchExecute).toHaveBeenCalledWith("");
      expect(result.success).toBeDefined();
      expect(result.prompts).toEqual(input);
    });
  });
});
