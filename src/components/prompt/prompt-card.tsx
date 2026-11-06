"use client";

import { PromptSummary } from "@/core/domain/prompts/entities/prompt";
import Link from "next/link";
import { Button } from "../ui/button";
import { TrashIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { deletePromptAction } from "@/app/actions/prompt.actions";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export interface PromptCardProps {
  prompt: PromptSummary;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deletePromptAction(prompt.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        return;
      }

      router.refresh();
    } catch (error) {
      const _error = error as Error;

      toast.error(_error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <motion.li
      aria-label={prompt.title}
      initial={{ opacity: 1, height: "auto" }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="p-3 rounded-lg transition-all duration-200 group relative hover:bg-gray-700"
    >
      <header className="flex items-start justify-between">
        <Link href={`/${prompt.id}`} prefetch className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-white grou-hover:text-accent-300 transition-colors">
            {prompt.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {prompt.content}
          </p>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="icon"
                size="icon"
                title="Remover prompt"
                aria-label="Remover prompt"
              >
                <TrashIcon className="size-3" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este prompt? Esta ação não pode
                ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
    </motion.li>
  );
}
