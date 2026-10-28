"use client";

import {
  ChangeEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

import { PromptSummary } from "@/core/domain/prompts/entities/prompt";

import { Button } from "../ui/button";
import { Logo } from "../logo";
import { Input } from "../ui/input";

import { PromptList } from "../prompt";
import { searchPromptsAction } from "@/app/actions/prompt.actions";
import { Spinner } from "../ui/spinner";

export interface SidebarContentProps {
  prompts: PromptSummary[];
}

export function SidebarContent({ prompts }: SidebarContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptsAction,
    { success: true, prompts }
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery ? (searchState.prompts ?? prompts) : prompts;

  const collapseSidebar = () => setIsCollapsed(true);
  const expandSidebar = () => setIsCollapsed(false);

  const handleNewPrompt = () => router.push("/new");

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : "/";

      router.push(url, { scroll: false });

      formRef.current?.requestSubmit();
    });
  };

  useEffect(() => {
    if (!hasQuery) return;

    formRef.current?.requestSubmit();
  }, [hasQuery]);

  return (
    <aside
      className={`border-r border-gray-700 flex flex-col h-full bg-gray-800 transition-[transform,width] duration-300 
      ease-in-out fixed md:relative left-0 top-0 z-50 md:z-auto w-[80vw] sm:w-[320px] ${isCollapsed ? "md:w-18" : "md:w-[384px]"}`}
    >
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="flex items-center justify-center mb-6">
            <Button
              onClick={expandSidebar}
              variant="icon"
              className="hidden md:inline-flex p-2  rounded-lg transition-colors
              hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
              aria-label="Expandir sidebar"
              title="Expandir sidebar"
            >
              <ArrowRightToLineIcon className="size-5 text-gray-100" />
            </Button>
          </header>
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleNewPrompt}
              aria-label="Novo prompt"
              title="Novo prompt"
            >
              <PlusIcon className="size-5 text-white" />
            </Button>
          </div>
        </section>
      )}
      {!isCollapsed && (
        <>
          <section className="p-6">
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  aria-label="Fechar menu"
                  title="Fechar menu"
                >
                  <XIcon className="size-5 text-gray-100" />
                </Button>
              </div>
            </div>
            <div className="flex w-full items-center justify-between mb-6">
              <header className="flex w-full items-center justify-between">
                <Logo />
                <Button
                  onClick={collapseSidebar}
                  variant="icon"
                  className="hidden md:inline-flex p-2 rounded-lg transition-colors
                  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  aria-label="Minimizar sidebar"
                  title="Minimizar sidebar"
                >
                  <ArrowLeftToLineIcon className="size-5 text-gray-100" />
                </Button>
              </header>
            </div>
            <section className="mb-5 ">
              <form
                action={searchAction}
                ref={formRef}
                className="relative group w-full"
              >
                <Input
                  name="q"
                  type="text"
                  value={query}
                  placeholder="Buscar prompts..."
                  onChange={handleQueryChange}
                  autoFocus
                />{" "}
                {isPending && (
                  <div
                    aria-label="Carregando prompts"
                    title="Carregando prompts"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-300"
                  >
                    <Spinner />
                  </div>
                )}
              </form>
            </section>
            <div>
              <Button onClick={handleNewPrompt} className="w-full" size="lg">
                <PlusIcon className="size-5 mr-2" />
                Novo prompt
              </Button>
            </div>
          </section>
          <nav
            className="flex-1 overflow-auto px-6 pb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            aria-label="Lista de prompts"
          >
            <PromptList prompts={promptList} />
          </nav>
        </>
      )}
    </aside>
  );
}
