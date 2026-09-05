import { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";

export function SettingsTab({ settings, onSaveSettings }) {
  const [form, setForm] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(form);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Configuración Global</h2>
        <p className="text-xs text-muted-foreground">Parámetros comerciales, fiscales y de despacho de la tienda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Comercial */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Datos Comerciales y Fiscales
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Razón Social</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={form.commercialName}
                onChange={(e) => setForm({ ...form, commercialName: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">RUC / Identificación Fiscal</label>
              <input
                type="text"
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground font-mono focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Dirección Física</label>
              <input
                type="text"
                value={form.physicalAddress}
                onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Canales de Contacto */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Canales de Notificación y Soporte
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Correo de Despachos</label>
              <input
                type="email"
                value={form.dispatchEmail}
                onChange={(e) => setForm({ ...form, dispatchEmail: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">WhatsApp de Pedidos</label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground font-mono focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Moneda y Pasarelas */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Parámetros de Cobro
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Moneda del Sistema</label>
              <input
                type="text"
                disabled
                value={form.currency}
                className="h-9 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Zona Horaria</label>
              <input
                type="text"
                disabled
                value={form.timeZone}
                className="h-9 w-full rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-foreground mb-1">Llave Pública Pasarela (Stripe)</label>
              <input
                type="text"
                value={form.stripePublishableKey}
                onChange={(e) => setForm({ ...form, stripePublishableKey: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground font-mono focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
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
