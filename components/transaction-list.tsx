"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Transaction = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: string;
  account: { name: string };
  category: { name: string } | null;
};

export function TransactionList() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await fetch("/api/transactions");
      return response.json();
    },
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma transação cadastrada ainda.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Conta</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {new Date(transaction.date).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell>{transaction.description || "—"}</TableCell>
            <TableCell>
              <span
                className={
                  transaction.type === "INCOME"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {transaction.type === "INCOME" ? "Receita" : "Despesa"}
              </span>
            </TableCell>
            <TableCell>{transaction.account.name}</TableCell>
            <TableCell>{transaction.category?.name || "—"}</TableCell>
            <TableCell className="text-right">
              R$ {Number(transaction.amount).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}