import { BudgetDialog } from "@/features/budgets/budget-dialog";
import { BudgetList } from "@/features/budgets/budget-list";

export default function BudgetsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Orçamentos</h1>
          <p className="text-sm text-zinc-500">Limites de gasto por categoria</p>
        </div>
        <BudgetDialog />
      </div>
      <BudgetList />
    </div>
  );
}