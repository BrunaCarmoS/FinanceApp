import { z } from "zod";

export const createBudgetSchema = z
  .object({
    amount: z.number().positive("O valor deve ser maior que zero"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    categoryId: z.string().uuid("Categoria inválida"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "A data final precisa ser depois da data inicial",
    path: ["endDate"],
  });

export const updateBudgetSchema = z.object({
  amount: z.number().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.string().uuid().optional(),
});

export type CreateBudgetInput = z.input<typeof createBudgetSchema>;
export type CreateBudgetOutput = z.output<typeof createBudgetSchema>;