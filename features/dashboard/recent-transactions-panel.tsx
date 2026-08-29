"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Transaction = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  category: { name: string } | null;
};

export function RecentTransactionsPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await fetch("/api/transactions");
      return response.json();
    },
  });

  const recent = data?.slice(0, 5) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-zinc-900">Últimas transações</h2>
        <Link href="/transactions" className="text-xs text-zinc-500 hover:text-zinc-900">
          Ver todas
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Carregando...</p>
      ) : recent.length === 0 ? (
        <p className="text-sm text-zinc-400">Nenhuma transação ainda.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                {t.type === "INCOME" ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {t.description || (t.type === "INCOME" ? "Receita" : "Despesa")}
                </p>
                <p className="text-xs text-zinc-400 truncate">{t.category?.name ?? "Sem categoria"}</p>
              </div>
              <p className="text-sm font-medium text-zinc-900 tabular-nums">
                {t.type === "INCOME" ? "+" : "-"} R$ {Number(t.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}