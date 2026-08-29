import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  balance: z.number().default(0),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.input<typeof createAccountSchema>;
export type CreateAccountOutput = z.output<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;