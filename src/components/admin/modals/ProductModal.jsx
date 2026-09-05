import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
  brands,
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: categories[0]?.name || "",
    brand: brands[0]?.name || "",
    price: "",
    comparePrice: "",
    stock: "",
    description: "",
    image: "",
    isFeatured: false,
    isNew: false,
  });

  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name || "",
        slug: productToEdit.slug || "",
        category: productToEdit.category || categories[0]?.name || "",
        brand: productToEdit.brand || brands[0]?.name || "",
        price: productToEdit.price || "",
        comparePrice: productToEdit.comparePrice || "",
        stock: productToEdit.stock || 0,
        description: productToEdit.description || "",
        image: productToEdit.images?.[0] || "",
        isFeatured: Boolean(productToEdit.isFeatured),
        isNew: Boolean(productToEdit.isNew),
      });
    } else {
      setForm({
        name: "",
        slug: "",
        category: categories[0]?.name || "",
        brand: brands[0]?.name || "",
        price: "",
        comparePrice: "",
        stock: 10,
        description: "",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop",
        isFeatured: false,
        isNew: true,
      });
    }
  }, [productToEdit, categories, brands, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: productToEdit ? prev.slug : generatedSlug,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      id: productToEdit?.id,
      price: Number(form.price) || 0,
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: Number(form.stock) || 0,
      images: [form.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop"],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {productToEdit ? "Editar Producto" : "Crear Nuevo Producto"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Nombre del Material</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleNameChange}
              placeholder="Ej. Plancha de Gypsum Standard 1/2"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Slug URL</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Marca</label>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Precio Normal ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Precio Oferta ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                placeholder="Opcional"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Stock Disponible</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">URL Imagen</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="size-4 rounded-sm border border-input text-primary"
              />
              Producto Destacado
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                className="size-4 rounded-sm border border-input text-primary"
              />
              Marcar como Nuevo
            </label>
          </div>

          <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
            >
              <Save className="size-4" />
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
