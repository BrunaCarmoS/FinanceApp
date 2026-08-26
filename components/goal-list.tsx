"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type Goal = {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: number;
  deadline: string | null;
};

function GoalCard({ goal }: { goal: Goal }) {
  const queryClient = useQueryClient();

  const target = Number(goal.targetAmount);
  const current = goal.currentAmount;
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = Math.max(target - current, 0);
  const isComplete = current >= target;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir meta");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  function handleDelete() {
    if (confirm("Tem certeza que quer excluir essa meta?")) {
      deleteMutation.mutate();
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{goal.name}</span>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Excluir
        </Button>
      </div>

      <Progress value={percentage} className={isComplete ? "[&>div]:bg-green-600" : ""} />

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          R$ {current.toFixed(2)} de R$ {target.toFixed(2)}
          {isComplete && <span className="text-green-600 font-medium"> (concluída)</span>}
        </span>
        {!isComplete && <span>Faltam R$ {remaining.toFixed(2)}</span>}
      </div>

      {goal.deadline && (
        <p className="text-xs text-muted-foreground">
          Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
        </p>
      )}

      <p className="text-xs text-muted-foreground pt-1">
        Contribua para essa meta criando uma transação de despesa vinculada a ela.
      </p>
    </div>
  );
}

export function GoalList() {
  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: async (): Promise<Goal[]> => {
      const response = await fetch("/api/goals");
      return response.json();
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!goals || goals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma meta cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}