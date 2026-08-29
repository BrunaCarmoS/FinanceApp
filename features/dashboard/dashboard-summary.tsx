"use client";

import { useQuery } from "@tanstack/react-query";
import { Wallet, ArrowDownRight, ArrowUpRight, ChevronUp, ChevronDown } from "lucide-react";

type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  changes: {
    balance: number | null;
    income: number | null;
    expense: number | null;
  };
};

const CARDS = [
  { key: "balance" as const, label: "Saldo total", icon: Wallet },
  { key: "totalIncome" as const, label: "Receitas", icon: ArrowDownRight, changeKey: "income" as const },
  { key: "totalExpense" as const, label: "Despesas", icon: ArrowUpRight, changeKey: "expense" as const },
];

function ChangeIndicator({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-zinc-400">sem dados do mês anterior</span>;
  }

  const isPositive = value >= 0;
  const Icon = isPositive ? ChevronUp : ChevronDown;

  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-zinc-500">
      <Icon size={14} />
      {Math.abs(value).toFixed(1)}%
      <span className="text-zinc-400">vs mês anterior</span>
    </span>
  );
}

export function DashboardSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async (): Promise<Summary> => {
      const response = await fetch("/api/dashboard/summary");
      return response.json();
    },
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-26 rounded-2xl bg-white border border-zinc-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = data[card.key];
        const change = card.changeKey ? data.changes[card.changeKey] : data.changes.balance;

        return (
          <div
            key={card.key}
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 flex items-start gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-zinc-500">{card.label}</p>
              <p className="text-2xl font-semibold text-zinc-900 mt-0.5 tabular-nums">
                R$ {value.toFixed(2)}
              </p>
              <div className="mt-1">
                <ChangeIndicator value={change} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}