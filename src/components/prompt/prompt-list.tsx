import { PromptSummary } from "@/core/domain/prompts/entities/prompt";
import { PromptCard } from "./prompt-card";
import { motion } from "motion/react";

export interface PromptListProps {
  prompts: PromptSummary[];
}

export function PromptList({ prompts }: PromptListProps) {
  return (
    <motion.ul
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layout
    >
      {prompts.map((prompt) => (
        <PromptCard prompt={prompt} key={prompt.id} />
      ))}
    </motion.ul>
  );
}
