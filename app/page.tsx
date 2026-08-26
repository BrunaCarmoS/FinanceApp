import Link from "next/link";

const modules = [
  { href: "/dashboard", label: "Dashboard", description: "Resumo financeiro geral" },
  { href: "/transactions", label: "Transações", description: "Registrar receitas e despesas" },
  { href: "/accounts", label: "Contas", description: "Gerenciar contas e saldos" },
  { href: "/categories", label: "Categorias", description: "Organizar por tipo de gasto/receita" },
  { href: "/budgets", label: "Orçamentos", description: "Limites de gasto por categoria" },
  { href: "/goals", label: "Metas", description: "Objetivos financeiros" },
  { href: "/recurrences", label: "Recorrências", description: "Transações automáticas" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col py-16 px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-2">
          Controle Financeiro
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Sistema de gestão financeira pessoal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-5 transition-colors hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]"
            >
              <h2 className="font-semibold text-black dark:text-zinc-50">
                {module.label}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {module.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}