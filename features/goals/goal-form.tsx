"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGoalSchema,
  CreateGoalInput,
  CreateGoalOutput,
} from "@/lib/validations/goal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GoalForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalInput, unknown, CreateGoalOutput>({
    resolver: zodResolver(createGoalSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateGoalOutput) => {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar meta");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      reset();
      onSuccess?.();
    },
  });

  function onSubmit(data: CreateGoalOutput) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da meta</Label>
        <Input id="name" placeholder="Ex: Viagem, Reserva de emergência..." {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="targetAmount">Valor objetivo</Label>
        <Input
          id="targetAmount"
          type="number"
          step="0.01"
          {...register("targetAmount", { valueAsNumber: true })}
        />
        {errors.targetAmount && (
          <p className="text-sm text-red-500">{errors.targetAmount.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="deadline">Prazo (opcional)</Label>
        <Input id="deadline" type="date" {...register("deadline")} />
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : "Criar meta"}
      </Button>
    </form>
  );
}