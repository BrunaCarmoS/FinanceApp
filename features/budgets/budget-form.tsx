"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBudgetSchema,
  CreateBudgetInput,
  CreateBudgetOutput,
} from "@/lib/validations/budget";
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

type Category = { id: string; name: string; color: string | null };
type Preset = { label: string; days?: number; months?: number; years?: number };

const PRESETS: Preset[] = [
  { label: "7 dias", days: 7 },
  { label: "15 dias", days: 15 },
  { label: "1 mês", months: 1 },
  { label: "5 meses", months: 5 },
  { label: "1 ano", years: 1 },
];

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

function calculateEndDate(preset: Preset) {
  const start = new Date();
  const end = new Date(start);

  if (preset.days !== undefined) end.setDate(end.getDate() + preset.days);
  if (preset.months !== undefined) end.setMonth(end.getMonth() + preset.months);
  if (preset.years !== undefined) end.setFullYear(end.getFullYear() + preset.years);

  return { start, end };
}

export function BudgetForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

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
    setValue,
    formState: { errors },
  } = useForm<CreateBudgetInput, unknown, CreateBudgetOutput>({
    resolver: zodResolver(createBudgetSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateBudgetOutput) => {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar orçamento");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      reset();
      onSuccess?.();
    },
  });

  function onSubmit(data: CreateBudgetOutput) {
    mutation.mutate(data);
  }

  function handlePresetChange(value: string | null) {
    if (!value) return;

    const preset = PRESETS.find((p) => p.label === value);
    if (!preset) return;

    const { start, end } = calculateEndDate(preset);

    setValue("startDate", formatDateInput(start) as never);
    setValue("endDate", formatDateInput(end) as never);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="categoryId">Categoria</Label>
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
        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="amount">Valor limite</Label>
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
        <Label htmlFor="preset">Prazo</Label>
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger id="preset">
            <SelectValue placeholder="Escolha um prazo pronto (ou preencha manualmente abaixo)" />
          </SelectTrigger>
          <SelectContent>
            {PRESETS.map((preset) => (
              <SelectItem key={preset.label} value={preset.label}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">Fim</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : "Criar orçamento"}
      </Button>
    </form>
  );
}