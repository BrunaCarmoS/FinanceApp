import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  balance: z.number().default(0),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type CreateAccountOutput = z.infer<typeof createAccountSchema>;
export type UpdateAccountOutput = z.infer<typeof updateAccountSchema>;