import { z } from "zod";

export const createRecurrenceSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive("O valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  startDate: z.coerce.date(),
  endDate: z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.date().optional()
  ),
  accountId: z.string().uuid("Conta inválida"),
  categoryId: z.string().uuid("Categoria inválida").optional(),
});

export type CreateRecurrenceInput = z.input<typeof createRecurrenceSchema>;
export type CreateRecurrenceOutput = z.output<typeof createRecurrenceSchema>;