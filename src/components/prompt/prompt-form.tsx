"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreatePromptDTO,
  createPromptSchema,
} from "@/core/application/prompts/create-prompt.dto";

import { createPromptAction } from "@/app/actions/prompt.actions";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Field, FieldError } from "../ui/field";
import { toast } from "sonner";
import { CopyButton } from "../action-buttons/copy-button";

export function PromptForm() {
  const router = useRouter();

  const form = useForm<CreatePromptDTO>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: { content: "", title: "" },
  });

  const content = useWatch({ control: form.control, name: "content" });

  async function submit(data: CreatePromptDTO) {
    const result = await createPromptAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <Field>
            <Input
              placeholder="Título do prompt"
              variant="transparent"
              size="lg"
              autoFocus
              aria-invalid
              {...field}
            />
            <FieldError>{form.formState.errors.title?.message}</FieldError>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <Field>
            <Textarea
              placeholder="Digite o conteúdo do prompt..."
              variant="transparent"
              size="lg"
              {...field}
            />
            <FieldError>{form.formState.errors.content?.message}</FieldError>
          </Field>
        )}
      />
      <footer className="flex flex-wrap gap-2 items-center mb-6 justify-end">
        <CopyButton content={content} />
        <Button type="submit" size="sm">
          Salvar
        </Button>
      </footer>
    </form>
  );
}
