import { DashboardSummary } from "@/components/dashboard-summary";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardSummary />
    </div>
  );
}