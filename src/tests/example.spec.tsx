import { render, screen } from "@/lib/test-utils";

describe("Example", () => {
  it("should run", () => {
    render(<div>Test</div>);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
