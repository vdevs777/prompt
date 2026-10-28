import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/test/utils";
import { SidebarContent, SidebarContentProps } from "./sidebar-content";

const pushMock = jest.fn();
let searchParamsMock = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => searchParamsMock,
}));

const initialPrompts = [
  {
    id: "1",
    title: "Title 01",
    content: "Content 01",
  },
];

function makeSut(
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) {
  return render(<SidebarContent prompts={prompts} />);
}

describe("Component: SidebarContent", () => {
  const user = userEvent.setup();

  describe("Base", () => {
    it("should render a 'new prompt' button", () => {
      makeSut();

      expect(screen.getByRole("complementary")).toBeVisible();
      expect(screen.getByRole("button", { name: "Novo prompt" })).toBeVisible();
    });

    it("should render prompt list", () => {
      const prompts = [
        {
          id: "1",
          title: "Title 01",
          content: "Content 01",
        },
        {
          id: "2",
          title: "Title 02",
          content: "Content 02",
        },
      ];

      makeSut({ prompts });

      expect(screen.getByText(prompts[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole("paragraph")).toHaveLength(2);
    });

    it("should change search input on typing", async () => {
      const text = "AI";

      makeSut();

      const searchInput = screen.getByPlaceholderText("Buscar prompts...");

      await user.type(searchInput, text);

      expect(searchInput).toHaveValue(text);
    });
  });

  describe("Collapse/Expand", () => {
    it("should show sidebar initially expanded and show collapse button", () => {
      makeSut();

      const aside = screen.getByRole("complementary");

      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });

      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole("button", {
        name: /expandir sidebar/i,
      });

      expect(expandButton).not.toBeInTheDocument();
    });

    it("should collapse sidebar and show expand button", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.getByRole("button", {
        name: /expandir sidebar/i,
      });

      expect(expandButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });

    it("should show create prompt button on collapsed sidebar", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const newPromptButton = screen.getByRole("button", {
        name: "Novo prompt",
      });

      expect(newPromptButton).toBeVisible();
    });

    it("should not show prompt list on collapsed sidebar", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const nav = screen.queryByRole("navigation");

      expect(nav).not.toBeInTheDocument();
    });

    it("should re-expand on clicking expand button", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /minimizar sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.getByRole("button", {
        name: /expandir sidebar/i,
      });

      await user.click(expandButton);

      expect(
        screen.getByRole("button", { name: /minimizar sidebar/i })
      ).toBeVisible();
      expect(
        screen.getByRole("navigation", { name: "Lista de prompts" })
      ).toBeVisible();
    });
  });

  describe("New prompt", () => {
    it("should navigate user to 'new prompt' page", async () => {
      makeSut();

      const newButton = screen.getByRole("button", { name: "Novo prompt" });

      await user.click(newButton);

      expect(pushMock).toHaveBeenCalledWith("/new");
    });
  });

  describe("Search", () => {
    it("should navigate with codified URL on typing and cleaning", async () => {
      const text = "A B";

      makeSut();

      const searchInput = screen.getByPlaceholderText("Buscar prompts...");

      await user.type(searchInput, text);

      expect(pushMock).toHaveBeenCalled();

      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe("/?q=A%20B");

      await user.clear(searchInput);
      const lastCallCleared = pushMock.mock.calls.at(-1);
      expect(lastCallCleared?.[0]).toBe("/");
    });

    it("should submit form on typing in the search field", async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, "requestSubmit")
        .mockImplementation(() => undefined);

      makeSut();

      const searchInput = screen.getByPlaceholderText("Buscar prompts...");

      await user.type(searchInput, "AI");

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });

    it("should start search input with search params", async () => {
      const text = "inicial";
      const searchParams = new URLSearchParams(`q=${text}`);

      searchParamsMock = searchParams;

      makeSut();

      const searchInput = screen.getByPlaceholderText("Buscar prompts...");

      await waitFor(() => expect(searchInput).toHaveValue(text));
    });

    it("should submit automatically on mounting when there is query", async () => {
      const submitSpy = jest
        .spyOn(HTMLFormElement.prototype, "requestSubmit")
        .mockImplementation(() => undefined);

      const text = "text";
      const searchParams = new URLSearchParams(`q=${text}`);
      searchParamsMock = searchParams;

      makeSut();

      expect(submitSpy).toHaveBeenCalled();
      submitSpy.mockRestore();
    });
  });
});
