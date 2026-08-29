"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type CategoryData = { name: string; color: string; total: number };

export function CategoryBreakdownChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-by-category"],
    queryFn: async (): Promise<CategoryData[]> => {
      const response = await fetch("/api/dashboard/by-category");
      return response.json();
    },
  });

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Carregando...</p>;
  }

  const total = data?.reduce((sum, c) => sum + c.total, 0) ?? 0;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-5">
        <h2 className="font-medium mb-4">Gastos por categoria</h2>
        <p className="text-sm text-zinc-500">Nenhuma despesa categorizada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5">
      <h2 className="font-medium mb-4">Gastos por categoria</h2>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} dataKey="total" innerRadius={45} outerRadius={65} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2">
          {data.map((category) => (
            <div key={category.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-zinc-700">{category.name}</span>
              </div>
              <span className="text-zinc-500">
                {total > 0 ? Math.round((category.total / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}