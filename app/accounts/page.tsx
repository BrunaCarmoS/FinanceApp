import { AccountDialog } from "@/features/accounts/account-dialog";
import { AccountList } from "@/features/accounts/account-list";

export default function AccountsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Contas</h1>
          <p className="text-sm text-zinc-500">Gerencie suas contas e saldos</p>
        </div>
        <AccountDialog />
      </div>
      <AccountList />
    </div>
  );
}