"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransactionSchema,
  CreateTransactionInput,
  CreateTransactionOutput,
} from "@/lib/validations/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Account = { id: string; name: string };
type Category = { id: string; name: string; color: string | null };
type Goal = { id: string; name: string };

type TransactionData = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  accountId: string;
  categoryId: string | null;
  goalId: string | null;
};

export function TransactionForm({
  transaction,
  onSuccess,
}: {
  transaction?: TransactionData;
  onSuccess?: () => void;
} = {}) {
  const queryClient = useQueryClient();
  const isEditing = !!transaction;

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const response = await fetch("/api/accounts");
      return response.json();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/categories");
      return response.json();
    },
  });

  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: async (): Promise<Goal[]> => {
      const response = await fetch("/api/goals");
      return response.json();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateTransactionInput, unknown, CreateTransactionOutput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: transaction
      ? {
          amount: Number(transaction.amount),
          type: transaction.type,
          description: transaction.description ?? "",
          date: transaction.date.split("T")[0] as never,
          accountId: transaction.accountId,
          categoryId: transaction.categoryId ?? undefined,
          goalId: transaction.goalId ?? undefined,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateTransactionOutput) => {
      const url = isEditing ? `/api/transactions/${transaction.id}` : "/api/transactions";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(isEditing ? "Erro ao editar transação" : "Erro ao criar transação");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      reset();
      onSuccess?.();
    },
  });

  function onSubmit(data: CreateTransactionOutput) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="type">Tipo</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Receita</SelectItem>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="accountId">Conta</Label>
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger id="accountId">
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.accountId && (
          <p className="text-sm text-red-500">{errors.accountId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="categoryId">Categoria</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Selecione uma categoria (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color ?? "#CCCCCC" }}
                      />
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="goalId">Doar para uma meta</Label>
        <Controller
          name="goalId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger id="goalId">
                <SelectValue placeholder="Nenhuma (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {goals?.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar transação"}
      </Button>
    </form>
  );
}