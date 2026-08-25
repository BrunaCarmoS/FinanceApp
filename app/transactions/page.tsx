import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";

export default function TransactionsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Transações</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Nova transação</h2>
        <TransactionForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Histórico</h2>
        <TransactionList />
      </div>
    </div>
  );
}