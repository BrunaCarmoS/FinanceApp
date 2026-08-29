import { CategoryDialog } from "@/features/categories/category-dialog";
import { CategoryList } from "@/features/categories/category-list";

export default function CategoriesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Categorias</h1>
          <p className="text-sm text-zinc-500">Organize por tipo de gasto/receita</p>
        </div>
        <CategoryDialog />
      </div>
      <CategoryList />
    </div>
  );
}