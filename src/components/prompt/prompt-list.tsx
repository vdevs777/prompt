import { PromptSummary } from "@/core/domain/prompts/entities/prompt";
import { PromptCard } from "./prompt-card";

export interface PromptListProps {
  prompts: PromptSummary[];
}

export function PromptList({ prompts }: PromptListProps) {
  return (
    <ul className="space-y-2">
      {prompts.map((prompt) => (
        <PromptCard prompt={prompt} key={prompt.id} />
      ))}
    </ul>
  );
}
