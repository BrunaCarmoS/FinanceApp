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

const nullableUuid = z.preprocess(
  (val) => (val === "" ? null : val),
  z.string().uuid().nullable().optional()
);

export const updateTransactionSchema = z.object({
  amount: z.number().positive("O valor deve ser maior que zero").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  accountId: z.string().uuid("Conta inválida").optional(),
  categoryId: nullableUuid,
  goalId: nullableUuid,
});

export type UpdateTransactionInput = z.input<typeof updateTransactionSchema>;
export type UpdateTransactionOutput = z.output<typeof updateTransactionSchema>;