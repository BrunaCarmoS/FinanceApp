import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive("O valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  accountId: z.string().uuid("Conta inválida"),
  categoryId: z.string().uuid("Categoria inválida").optional(),
  goalId: z.string().uuid("Meta inválida").optional(),
});

export type CreateTransactionInput = z.input<typeof createTransactionSchema>;
export type CreateTransactionOutput = z.output<typeof createTransactionSchema>;