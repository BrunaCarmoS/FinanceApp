import { z } from "zod";

export const createGoalSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  targetAmount: z.number().positive("O valor deve ser maior que zero"),
  deadline: z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.date().optional()
  ),
});

export type CreateGoalInput = z.input<typeof createGoalSchema>;
export type CreateGoalOutput = z.output<typeof createGoalSchema>;