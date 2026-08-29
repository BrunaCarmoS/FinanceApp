import { RecurrenceDialog } from "@/features/recurrences/recurrence-dialog";
import { RecurrenceList } from "@/features/recurrences/recurrence-list";

export default function RecurrencesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Recorrências</h1>
          <p className="text-sm text-zinc-500">Transações automáticas</p>
        </div>
        <RecurrenceDialog />
      </div>
      <RecurrenceList />
    </div>
  );
}