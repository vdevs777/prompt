import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { toast } from "sonner";
import { PromptForm, PromptFormProps } from "./prompt-form";

const refreshMock = jest.fn();
const createPromptActionMock = jest.fn();
const updatePromptActionMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

jest.mock("@/app/actions/prompt.actions", () => ({
  createPromptAction: (...args: unknown[]) => createPromptActionMock(...args),
  updatePromptAction: (...args: unknown[]) => updatePromptActionMock(...args),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const makeSut = ({ prompt }: PromptFormProps = {}) =>
  render(<PromptForm prompt={prompt} />);

describe("Component: PromptForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    createPromptActionMock.mockReset();
    updatePromptActionMock.mockReset();
    refreshMock.mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
  });

  it("should create a new prompt successfully", async () => {
    const successMessage = "Prompt created successfully.";

    createPromptActionMock.mockResolvedValueOnce({
      success: true,
      message: successMessage,
    });

    makeSut();

    const titleInput = screen.getByPlaceholderText("Título do prompt");
    await user.type(titleInput, "title");

    const contentInput = screen.getByPlaceholderText(
      "Digite o conteúdo do prompt..."
    );
    await user.type(contentInput, "content");

    const submitButton = screen.getByRole("button", { name: "Salvar" });
    await user.click(submitButton);

    expect(createPromptActionMock).toHaveBeenCalledWith({
      title: "title",
      content: "content",
    });
    expect(toast.success).toHaveBeenCalledWith(successMessage);
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("should show an error when create action fails", async () => {
    const errorMessage = "error";

    createPromptActionMock.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    });

    makeSut();

    const titleInput = screen.getByPlaceholderText("Título do prompt");
    await user.type(titleInput, "title");

    const contentInput = screen.getByPlaceholderText(
      "Digite o conteúdo do prompt..."
    );
    await user.type(contentInput, "content");

    const submitButton = screen.getByRole("button", { name: "Salvar" });
    await user.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("should show error messages when form is empty", async () => {
    makeSut();

    const submitButton = screen.getByRole("button", { name: "Salvar" });
    await user.click(submitButton);

    expect(screen.getByText("Título é obrigatório")).toBeVisible();
    expect(screen.getByText("Conteúdo é obrigatório")).toBeVisible();
    expect(createPromptActionMock).not.toHaveBeenCalled();
  });

  it("should update existing prompt successfully", async () => {
    updatePromptActionMock.mockResolvedValueOnce({
      success: true,
      message: "Prompt updated successfully.",
    });

    const now = new Date();

    const prompt = {
      id: "1",
      title: "old title",
      content: "old content",
      createdAt: now,
      updatedAt: now,
    };

    makeSut({ prompt });

    const titleInput = screen.getByPlaceholderText("Título do prompt");
    const contentInput = screen.getByPlaceholderText(
      "Digite o conteúdo do prompt..."
    );

    await user.clear(titleInput);
    await user.type(titleInput, "new title");

    await user.clear(contentInput);
    await user.type(contentInput, "new content");

    const submitButton = screen.getByRole("button", { name: "Salvar" });

    await user.click(submitButton);

    expect(updatePromptActionMock).toHaveBeenCalledWith({
      id: prompt.id,
      title: "new title",
      content: "new content",
    });
    expect(toast.success).toHaveBeenCalledWith("Prompt updated successfully.");
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
