"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Recurrence = {
  id: string;
  description: string | null;
  amount: string;
  type: "INCOME" | "EXPENSE";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  endDate: string | null;
  lastGeneratedDate: string | null;
  account: { name: string };
  category: { name: string } | null;
};

const FREQUENCY_LABELS: Record<Recurrence["frequency"], string> = {
  DAILY: "Diária",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  YEARLY: "Anual",
};

export function RecurrenceList() {
  const queryClient = useQueryClient();

  const { data: recurrences, isLoading } = useQuery({
    queryKey: ["recurrences"],
    queryFn: async (): Promise<Recurrence[]> => {
      const response = await fetch("/api/recurrences");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/recurrences/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir recorrência");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurrences"] });
    },
  });

  function handleDelete(id: string) {
    if (confirm("Tem certeza que quer excluir essa recorrência? As transações já geradas por ela não serão apagadas.")) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!recurrences || recurrences.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma recorrência cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Frequência</TableHead>
            <TableHead>Conta</TableHead>
            <TableHead>Última geração</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recurrences.map((recurrence) => (
            <TableRow key={recurrence.id}>
              <TableCell>{recurrence.description || "—"}</TableCell>
              <TableCell>
                <span
                  className={
                    recurrence.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }
                >
                  {recurrence.type === "INCOME" ? "Receita" : "Despesa"}
                </span>
              </TableCell>
              <TableCell>{FREQUENCY_LABELS[recurrence.frequency]}</TableCell>
              <TableCell>{recurrence.account.name}</TableCell>
              <TableCell>
                {recurrence.lastGeneratedDate
                  ? new Date(recurrence.lastGeneratedDate).toLocaleDateString("pt-BR")
                  : "Ainda não gerou"}
              </TableCell>
              <TableCell className="text-right">
                R$ {Number(recurrence.amount).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(recurrence.id)}
                  disabled={deleteMutation.isPending}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  
  );
}