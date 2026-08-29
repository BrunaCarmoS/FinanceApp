"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Wallet } from "lucide-react";

type Account = { id: string; name: string; balance: string };

export function AccountsPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async (): Promise<Account[]> => {
      const response = await fetch("/api/accounts");
      return response.json();
    },
  });

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-zinc-900">Contas</h2>
        <Link href="/accounts" className="text-xs text-zinc-500 hover:text-zinc-900">
          Ver todas
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Carregando...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-zinc-400">Nenhuma conta cadastrada.</p>
      ) : (
        <div className="space-y-3">
          {data.map((account) => (
            <div key={account.id} className="card-interactive bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
              <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                <Wallet size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">{account.name}</p>
                <p className="text-xs text-zinc-400">Conta</p>
              </div>
              <p className="text-sm font-medium text-zinc-900 tabular-nums">
                R$ {Number(account.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}