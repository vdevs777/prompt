import { render, screen } from "@/test/utils";
import { Logo } from "./logo";

describe("Component: Logo", () => {
  it("should render link to home with text", () => {
    render(<Logo />);

    const link = screen.getByRole("link", { name: "PROMPTS" });

    expect(link).toBeVisible();
    expect(link).toHaveAttribute("href", "/");
  });
});
