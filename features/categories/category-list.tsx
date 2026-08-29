"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

type Category = { id: string; name: string; color: string | null };

export function CategoryList() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/categories");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir categoria");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  function handleDelete(id: string) {
    if (confirm("Tem certeza que quer excluir essa categoria?")) deleteMutation.mutate(id);
  }

  if (isLoading) return <p className="text-sm text-zinc-400">Carregando...</p>;
  if (!data || data.length === 0)
    return <p className="text-sm text-zinc-400">Nenhuma categoria cadastrada ainda.</p>;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm divide-y divide-zinc-100">
      {data.map((category) => (
        <div key={category.id} className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span
              className="h-3.5 w-3.5 rounded-full shrink-0"
              style={{ backgroundColor: category.color ?? "#CCCCCC" }}
            />
            <span className="text-sm font-medium text-zinc-900">{category.name}</span>
          </div>
          <button
            onClick={() => handleDelete(category.id)}
            className="text-zinc-300 hover:text-red-600 transition-colors"
            aria-label="Excluir categoria"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}