"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type Budget = {
  id: string;
  amount: string;
  spent: number;
  startDate: string;
  endDate: string;
  category: { name: string; color: string | null };
};

export function BudgetList() {
  const queryClient = useQueryClient();

  const { data: budgets, isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: async (): Promise<Budget[]> => {
      const response = await fetch("/api/budgets");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir orçamento");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });

  function handleDelete(id: string) {
    if (confirm("Tem certeza que quer excluir esse orçamento?")) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!budgets || budgets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum orçamento cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const limit = Number(budget.amount);
        const percentage = limit > 0 ? Math.min((budget.spent / limit) * 100, 100) : 0;
        const isOverBudget = budget.spent > limit;

        return (
          <div key={budget.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: budget.category.color ?? "#CCCCCC" }}
                />
                <span className="font-medium">{budget.category.name}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(budget.id)}
                disabled={deleteMutation.isPending}
              >
                Excluir
              </Button>
            </div>

            <Progress
              value={percentage}
              className={isOverBudget ? "[&>div]:bg-red-600" : ""}
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                R$ {budget.spent.toFixed(2)} de R$ {limit.toFixed(2)}
                {isOverBudget && (
                  <span className="text-red-600 font-medium"> (excedido)</span>
                )}
              </span>
              <span>
                {new Date(budget.startDate).toLocaleDateString("pt-BR")} –{" "}
                {new Date(budget.endDate).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}