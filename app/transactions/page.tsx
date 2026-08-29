import { TransactionDialog } from "@/features/transactions/transaction-dialog";
import { TransactionList } from "@/features/transactions/transaction-list";

export default function TransactionsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Transações</h1>
          <p className="text-sm text-zinc-500">Gerencie todas as suas movimentações</p>
        </div>
        <TransactionDialog />
      </div>

      <TransactionList />
    </div>
  );
}