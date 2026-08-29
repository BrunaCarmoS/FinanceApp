"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecurrenceSchema,
  CreateRecurrenceInput,
  CreateRecurrenceOutput,
} from "@/lib/validations/recurrence";
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

export function RecurrenceForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

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

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateRecurrenceInput, unknown, CreateRecurrenceOutput>({
    resolver: zodResolver(createRecurrenceSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateRecurrenceOutput) => {
      const response = await fetch("/api/recurrences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar recorrência");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurrences"] });
      reset();
      onSuccess?.();
    },
  });

  function onSubmit(data: CreateRecurrenceOutput) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" placeholder="Ex: Netflix, Salário..." {...register("description")} />
      </div>

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
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          {...register("type")}
          className="w-full border rounded-md h-9 px-3 bg-background"
        >
          <option value="">Selecione...</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="frequency">Frequência</Label>
        <select
          id="frequency"
          {...register("frequency")}
          className="w-full border rounded-md h-9 px-3 bg-background"
        >
          <option value="">Selecione...</option>
          <option value="DAILY">Diária</option>
          <option value="WEEKLY">Semanal</option>
          <option value="MONTHLY">Mensal</option>
          <option value="YEARLY">Anual</option>
        </select>
        {errors.frequency && (
          <p className="text-sm text-red-500">{errors.frequency.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">Fim (opcional)</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
        </div>
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
        <Label htmlFor="categoryId">Categoria (opcional)</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : "Criar recorrência"}
      </Button>
    </form>
  );
}