import { Search, Plus, Pencil, Trash2, FolderTree, AlertTriangle } from "lucide-react";

export function CategoriesTab({
  categories,
  onOpenNewCategoryModal,
  onOpenEditCategoryModal,
  onDeleteCategory,
}) {
  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Categorías de Productos</h2>
          <p className="text-xs text-muted-foreground">Estructura y clasificación del catálogo</p>
        </div>

        <button
          type="button"
          onClick={onOpenNewCategoryModal}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* ── Grid de Categorías ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
                  <FolderTree className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{category.slug}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOpenEditCategoryModal(category)}
                  className="flex size-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Editar categoría"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCategory(category)}
                  className="flex size-8 items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Eliminar categoría"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Productos asignados:</span>
              <span className="font-mono font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md">
                {category.productCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
