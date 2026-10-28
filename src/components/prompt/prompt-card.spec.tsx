import { render, screen } from "@/test/utils";
import { PromptCard, PromptCardProps } from "./prompt-card";

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

describe("Component: PromptCard", () => {
  it("should render link with 'href' correctly", () => {
    const prompt = { id: "1", title: "title 01", content: "content 01" };

    makeSut({ prompt });

    const link = screen.getByRole("link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/${prompt.id}`);
  });
});
