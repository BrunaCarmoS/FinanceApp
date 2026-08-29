"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAccountSchema,
  CreateAccountInput,
  CreateAccountOutput,
} from "@/lib/validations/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Account = { id: string; name: string; balance: string };

export function AccountForm({
  account,
  onSuccess,
}: {
  account?: Account;
  onSuccess?: () => void;
} = {}) {
  const queryClient = useQueryClient();
  const isEditing = !!account;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountInput, unknown, CreateAccountOutput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: account
      ? { name: account.name, balance: Number(account.balance) }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateAccountOutput) => {
      const url = isEditing ? `/api/accounts/${account.id}` : "/api/accounts";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Erro ao editar conta" : "Erro ao criar conta");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      reset();
      onSuccess?.();
    },
  });

  function onSubmit(data: CreateAccountOutput) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Ex: Nubank, Carteira..." {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="balance">{isEditing ? "Saldo" : "Saldo inicial"}</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          {...register("balance", { valueAsNumber: true })}
        />
        {errors.balance && (
          <p className="text-sm text-red-500">{errors.balance.message}</p>
        )}
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar conta"}
      </Button>
    </form>
  );
}