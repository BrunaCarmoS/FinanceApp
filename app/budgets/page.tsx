import { BudgetForm } from "@/components/budget-form";
import { BudgetList } from "@/components/budget-list";

export default function BudgetsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Orçamentos</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Novo orçamento</h2>
        <BudgetForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Seus orçamentos</h2>
        <BudgetList />
      </div>
    </div>
  );
}