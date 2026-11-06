import z from "zod";

export const updatePromptSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export type UpdatePromptDTO = z.infer<typeof updatePromptSchema>;
