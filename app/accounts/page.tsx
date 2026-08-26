import { AccountForm } from "@/components/account-form";
import { AccountList } from "@/components/account-list";

export default function AccountsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Contas</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Nova conta</h2>
        <AccountForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Suas contas</h2>
        <AccountList />
      </div>
    </div>
  );
}