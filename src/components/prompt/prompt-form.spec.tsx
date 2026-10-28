import { toast } from "sonner";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/utils";
import { PromptForm } from "./prompt-form";

const refreshMock = jest.fn();
const createPromptActionMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

jest.mock("@/app/actions/prompt.actions", () => ({
  createPromptAction: (...args: unknown[]) => createPromptActionMock(...args),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const makeSut = () => render(<PromptForm />);

describe("Component: PromptForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    createPromptActionMock.mockReset();
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
});
