"use client";

import { useQuery } from "@tanstack/react-query";

type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export function DashboardSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async (): Promise<Summary> => {
      const response = await fetch("/api/dashboard/summary");
      return response.json();
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="border rounded-lg p-5">
        <p className="text-sm text-muted-foreground">Receitas</p>
        <p className="text-2xl font-semibold text-green-600 mt-1">
          R$ {data.totalIncome.toFixed(2)}
        </p>
      </div>

      <div className="border rounded-lg p-5">
        <p className="text-sm text-muted-foreground">Despesas</p>
        <p className="text-2xl font-semibold text-red-600 mt-1">
          R$ {data.totalExpense.toFixed(2)}
        </p>
      </div>

      <div className="border rounded-lg p-5">
        <p className="text-sm text-muted-foreground">Saldo</p>
        <p
          className={`text-2xl font-semibold mt-1 ${
            data.balance >= 0 ? "text-zinc-900 dark:text-zinc-50" : "text-red-600"
          }`}
        >
          R$ {data.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}