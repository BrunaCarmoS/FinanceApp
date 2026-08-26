import { RecurrenceForm } from "@/components/recurrence-form";
import { RecurrenceList } from "@/components/recurrence-list";

export default function RecurrencesPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Recorrências</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Nova recorrência</h2>
        <RecurrenceForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Suas recorrências</h2>
        <RecurrenceList />
      </div>
    </div>
  );
}