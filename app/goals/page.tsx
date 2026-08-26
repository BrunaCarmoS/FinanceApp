import { GoalForm } from "@/components/goal-form";
import { GoalList } from "@/components/goal-list";

export default function GoalsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Metas</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Nova meta</h2>
        <GoalForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Suas metas</h2>
        <GoalList />
      </div>
    </div>
  );
}