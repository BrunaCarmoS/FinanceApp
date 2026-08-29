import { GoalDialog } from "@/features/goals/goal-dialog";
import { GoalList } from "@/features/goals/goal-list";

export default function GoalsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Metas</h1>
          <p className="text-sm text-zinc-500">Acompanhe seus objetivos financeiros</p>
        </div>
        <GoalDialog />
      </div>
      <GoalList />
    </div>
  );
}