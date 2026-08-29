import { DashboardSummary } from "@/features/dashboard/dashboard-summary";
import { CashflowChart } from "@/features/dashboard/cashflow-chart";
import { CategoryBreakdownChart } from "@/features/dashboard/category-breakdown-chart";
import { AccountsPanel } from "@/features/dashboard/accounts-panel";
import { RecentTransactionsPanel } from "@/features/dashboard/recent-transactions-panel";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Visão geral da sua vida financeira</p>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CashflowChart />
        <CategoryBreakdownChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AccountsPanel />
        <RecentTransactionsPanel />
      </div>
    </div>
  );
}