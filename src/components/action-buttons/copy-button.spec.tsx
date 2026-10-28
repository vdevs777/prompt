import { act, render, screen, waitFor } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { CopyButton, CopyButtonProps } from "./copy-button";
import { toast } from "sonner";

jest.mock("sonner", () => ({ toast: { error: jest.fn() } }));
const writeTextMock = jest.fn();

const makeSut = ({ content = "" }: CopyButtonProps = {} as CopyButtonProps) => {
  return render(<CopyButton content={content} />);
};

describe("Component: CopyButton", () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  beforeEach(() => {
    writeTextMock.mockReset();

    Object.defineProperty(global.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  it("should disable button when content is empty", async () => {
    makeSut();

    const button = screen.getByRole("button", { name: /copy/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(writeTextMock).not.toHaveBeenCalled();
  });

  it("should copy, change label to 'copied' and turn back to 'copy'", async () => {
    writeTextMock.mockResolvedValueOnce(undefined);

    const content = "text";

    makeSut({ content });

    const button = screen.getByRole("button", { name: /copy/i });
    await user.click(button);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /copied/i })
      ).toBeInTheDocument()
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });
  });

  it("should clean previous timer before copying again", async () => {
    writeTextMock.mockResolvedValueOnce(undefined);

    const clearSpy = jest.spyOn(window, "clearTimeout");

    const content = "text";

    makeSut({ content });
    const button = screen.getByRole("button", { name: /copy/i });
    await user.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /copied/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /copied/i }));

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it("should show an error toast when copy action fails", async () => {
    const errorMessage = "Fail on copying.";
    const error = new Error(errorMessage);

    jest
      .spyOn(global.navigator.clipboard, "writeText")
      .mockRejectedValueOnce(error);

    const content = "text";

    makeSut({ content });

    const button = screen.getByRole("button", { name: /copy/i });
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        `Erro ao copiar o texto: ${errorMessage}`
      );
    });
    expect(screen.getByRole("button", { name: /copy/i })).toBeVisible();
  });
});
