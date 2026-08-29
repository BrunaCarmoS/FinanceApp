"use client";

import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type TimelinePoint = { date: string; income: number; expense: number };

export function CashflowChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-timeline"],
    queryFn: async (): Promise<TimelinePoint[]> => {
      const response = await fetch("/api/dashboard/timeline");
      return response.json();
    },
  });

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Carregando...</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-medium mb-4">Fluxo de caixa</h2>
        <p className="text-sm text-zinc-500">Sem transações nos últimos 30 dias.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5">
      <h2 className="font-medium mb-4">Fluxo de caixa (últimos 30 dias)</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$ ${Number(v).toFixed(2)}`} />
          <Tooltip
            formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            labelFormatter={(value) => new Date(value as string).toLocaleDateString("pt-BR")}
          />
          <Line type="monotone" dataKey="income" stroke="#18181b" strokeWidth={2} name="Receitas" dot={false} />
          <Line type="monotone" dataKey="expense" stroke="#a1a1aa" strokeWidth={2} name="Despesas" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}