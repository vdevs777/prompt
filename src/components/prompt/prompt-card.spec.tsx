import { render, screen } from "@/test/utils";
import { PromptCard, PromptCardProps } from "./prompt-card";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

const deleteMock = jest.fn();

jest.mock("@/app/actions/prompt.actions", () => ({
  deletePromptAction: (id: string) => deleteMock(id),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock }),
}));

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

describe("Component: PromptCard", () => {
  beforeEach(() => {
    deleteMock.mockReset();
    refreshMock.mockReset();
    (toast.success as jest.Mock).mockReset();
  });

  const user = userEvent.setup();
  const prompt = { id: "1", title: "title 01", content: "content 01" };

  it("should render link with 'href' correctly", () => {
    makeSut({ prompt });

    const link = screen.getByRole("link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/${prompt.id}`);
  });

  it("should open delete dialog", async () => {
    makeSut({ prompt });

    const deleteButton = screen.getByRole("button", {
      name: "Remover prompt",
    });
    await user.click(deleteButton);

    expect(screen.getByText("Remover prompt")).toBeInTheDocument();
  });

  it("should remove successfully and show toast", async () => {
    deleteMock.mockResolvedValue({
      success: true,
      message: "Prompt removido com sucesso!",
    });

    makeSut({ prompt });

    const deleteButton = screen.getByRole("button", { name: "Remover prompt" });

    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(toast.success).toHaveBeenCalledWith("Prompt removido com sucesso!");
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("should show error when action fails", async () => {
    const errorMessage = "Erro ao remover prompt.";

    deleteMock.mockResolvedValue({ success: false, message: errorMessage });

    makeSut({ prompt });

    const deleteButton = screen.getByRole("button", { name: "Remover prompt" });

    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("should show error when action throws an error", async () => {
    const errorMessage = "Erro ao remover prompt.";

    deleteMock.mockRejectedValueOnce(new Error(errorMessage));

    makeSut({ prompt });

    const deleteButton = screen.getByRole("button", { name: "Remover prompt" });

    await user.click(deleteButton);
    await user.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
