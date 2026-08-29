"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transaction = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  account: { name: string };
  category: { name: string; color: string | null } | null;
};

export function TransactionList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await fetch("/api/transactions");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir transação");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  function handleDelete(id: string) {
    if (confirm("Tem certeza que quer excluir essa transação?")) {
      deleteMutation.mutate(id);
    }
  }

  const filtered = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((t) => {
      const matchesSearch = search
        ? (t.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
          t.account.name.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchesType = typeFilter === "ALL" ? true : t.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Carregando...</p>;
  }

  return (
    <div className="bg-white rounded-xl border">
      <div className="flex flex-col sm:flex-row gap-3 p-4 border-b">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
         <Input
  placeholder="Buscar transações..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
  style={{ paddingLeft: "2.25rem" }}
/>
        </div>

        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value ?? "ALL")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os tipos</SelectItem>
            <SelectItem value="INCOME">Receita</SelectItem>
            <SelectItem value="EXPENSE">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 p-6 text-center">
          Nenhuma transação encontrada.
        </p>
      ) : (
        <table className="w-full text-sm fade-in">
          <thead>
            <tr className="text-left text-zinc-500 border-b">
              <th className="font-normal px-4 py-3">Data</th>
              <th className="font-normal px-4 py-3">Descrição</th>
              <th className="font-normal px-4 py-3">Categoria</th>
              <th className="font-normal px-4 py-3">Conta</th>
              <th className="font-normal px-4 py-3">Tipo</th>
              <th className="font-normal px-4 py-3 text-right">Valor</th>
              <th className="font-normal px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b last:border-0 hover:bg-zinc-50">
                <td className="px-4 py-3 text-zinc-600">
                  {new Date(t.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {t.description || "—"}
                </td>
                <td className="px-4 py-3">
                  {t.category ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${t.category.color ?? "#CCCCCC"}20`,
                        color: t.category.color ?? "#666",
                      }}
                    >
                      {t.category.name}
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">{t.account.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    {t.type === "INCOME" ? (
                      <ArrowUpRight size={14} className="text-emerald-600" />
                    ) : (
                      <ArrowDownRight size={14} className="text-red-600" />
                    )}
                    <span className="text-zinc-600">
                      {t.type === "INCOME" ? "Receita" : "Despesa"}
                    </span>
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    t.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {t.type === "INCOME" ? "+" : "-"} R$ {Number(t.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-zinc-400 hover:text-red-600 transition-colors"
                    aria-label="Excluir transação"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}