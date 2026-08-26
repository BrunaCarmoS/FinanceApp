import { CategoryForm } from "@/components/category-form";
import { CategoryList } from "@/components/category-list";

export default function CategoriesPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Categorias</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Nova categoria</h2>
        <CategoryForm />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Suas categorias</h2>
        <CategoryList />
      </div>
    </div>
  );
}