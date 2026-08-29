"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  BarChart3,
  Target,
} from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
  { href: "/accounts", label: "Contas", icon: Wallet },
  { href: "/budgets", label: "Budget", icon: PiggyBank },
  { href: "/goals", label: "Metas", icon: Target },
  { href: "/categories", label: "Categorias", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-zinc-950 text-zinc-100 min-h-screen p-4">
      <div className="flex items-center gap-2 px-2 py-3">
        <Image src="/finance.svg" alt="financeApp" width={32} height={32} />
        <span className="font-semibold">financeApp</span>
      </div>

      <nav className="flex flex-col gap-1 mt-4 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

            <div className="flex items-center gap-3 px-2 py-3 border-t border-zinc-800 mt-auto">
        <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-medium text-white shrink-0">
          H
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Hop</span>
          <span className="text-xs text-zinc-500">Ver perfil</span>
        </div>
      </div>
    </aside>
  );
}