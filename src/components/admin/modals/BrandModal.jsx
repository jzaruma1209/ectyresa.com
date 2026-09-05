import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export function BrandModal({ isOpen, onClose, onSave, brandToEdit }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    if (brandToEdit) {
      setName(brandToEdit.name || "");
      setSlug(brandToEdit.slug || "");
      setLogo(brandToEdit.logo || "");
    } else {
      setName("");
      setSlug("");
      setLogo("");
    }
  }, [brandToEdit, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!brandToEdit) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
      );
      setLogo(val.slice(0, 1).toUpperCase());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: brandToEdit?.id,
      name,
      slug,
      logo: logo || name.slice(0, 1).toUpperCase(),
      productCount: brandToEdit ? brandToEdit.productCount : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {brandToEdit ? "Editar Marca" : "Nueva Marca"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Nombre de la Marca</label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="Ej. Novacero"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Slug URL</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Letra o Inicial del Logo</label>
            <input
              type="text"
              maxLength={2}
              value={logo}
              onChange={(e) => setLogo(e.target.value.toUpperCase())}
              placeholder="Ej. N"
              className="h-9 w-20 rounded-md border border-input bg-background px-3 text-sm text-center font-bold text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
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
              Guardar Marca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
