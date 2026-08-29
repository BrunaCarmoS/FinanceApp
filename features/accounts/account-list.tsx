"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountForm } from "./account-form";

type Account = { id: string; name: string; balance: string };

export function AccountList() {
  const queryClient = useQueryClient();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const response = await fetch("/api/accounts");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir conta");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });

  function handleDelete(id: string) {
    if (confirm("Tem certeza que quer excluir essa conta?")) deleteMutation.mutate(id);
  }

  if (isLoading) return <p className="text-sm text-zinc-400">Carregando...</p>;
  if (!data || data.length === 0)
    return <p className="text-sm text-zinc-400">Nenhuma conta cadastrada ainda.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((account) => (
          <div
            key={account.id}
            className="card-interactive bg-white rounded-2xl border border-zinc-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                <Wallet size={18} />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingAccount(account)}
                  className="text-zinc-300 hover:text-zinc-900 transition-colors"
                  aria-label="Editar conta"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="text-zinc-300 hover:text-red-600 transition-colors"
                  aria-label="Excluir conta"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-zinc-900 mt-3">{account.name}</p>
            <p className="text-xs text-zinc-400">Conta</p>
            <p className="text-xl font-semibold text-zinc-900 mt-2 tabular-nums">
              R$ {Number(account.balance).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <Dialog
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar conta</DialogTitle>
          </DialogHeader>
          {editingAccount && (
            <AccountForm
              account={editingAccount}
              onSuccess={() => setEditingAccount(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}