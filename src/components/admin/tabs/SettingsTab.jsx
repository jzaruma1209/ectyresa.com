import { useState } from "react";
import { Save } from "lucide-react";

export function SettingsTab({ settings, onSaveSettings }) {
  const [form, setForm] = useState(
    settings || {
      storeName: "ECTYRE Llantas & Servicios",
      businessName: "ECTYRE S.A.",
      commercialName: "ECTYRE Neumáticos y Servicios Automotrices",
      taxId: "1790012345001",
      physicalAddress: "Av. Principal y Panamericana Norte, Quito, Ecuador",
      dispatchEmail: "despachos@ectyre.com",
      whatsappNumber: "+593 99 999 9999",
      currency: "USD ($)",
      timeZone: "America/Guayaquil (GMT-5)",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(form);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Configuración de la Tienda</h2>
        <p className="text-xs text-muted-foreground">
          Parámetros comerciales, facturación y canales de despacho de ECTYRE
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Comercial */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Datos Comerciales y Facturación
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Razón Social</label>
              <input
                type="text"
                value={form.businessName || ""}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={form.commercialName || ""}
                onChange={(e) => setForm({ ...form, commercialName: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">RUC / Identificación Fiscal</label>
              <input
                type="text"
                value={form.taxId || ""}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground font-mono focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Dirección Principal / Taller</label>
              <input
                type="text"
                value={form.physicalAddress || ""}
                onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Canales de Contacto */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Canales de Despacho y Atención
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Correo de Notificaciones</label>
              <input
                type="email"
                value={form.dispatchEmail || ""}
                onChange={(e) => setForm({ ...form, dispatchEmail: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">WhatsApp de Pedidos</label>
              <input
                type="text"
                value={form.whatsappNumber || ""}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground font-mono focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Moneda y Región */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Parámetros Regionales
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Moneda del Sistema</label>
              <input
                type="text"
                disabled
                value={form.currency || "USD ($)"}
                className="h-9 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Zona Horaria</label>
              <input
                type="text"
                disabled
                value={form.timeZone || "America/Guayaquil (GMT-5)"}
                className="h-9 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
          >
            <Save className="size-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>
    </div>
  );
}
