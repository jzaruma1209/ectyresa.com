import { useState, useEffect } from "react";
import { X, MapPin, Phone, Mail, User, RotateCw, Layers } from "lucide-react";
import adminService from "@/services/admin.service";

export function OrderDetailModal({ orderId, onClose }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setDetalle(null);
      return;
    }

    const fetchDetalle = async () => {
      try {
        setLoading(true);
        setError(null);
        // Si orderId es un id o un objeto
        const id = typeof orderId === "object" ? (orderId.id || orderId.idPedido) : orderId;
        const res = await adminService.getPedidoById(id);
        const payload = res?.data ?? res;
        setDetalle(payload);
      } catch (err) {
        console.error("Error al cargar detalle del pedido:", err);
        setError("No se pudo cargar la información detallada del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [orderId]);

  if (!orderId) return null;

  const idPedido = detalle?.id || detalle?.idPedido || orderId;
  const cliente = detalle?.cliente || {};
  const direccion = detalle?.direccionEntrega || detalle?.direccion;
  const direccionTexto =
    typeof direccion === "object" && direccion
      ? [direccion.direccionCompleta || direccion.direccion, direccion.ciudad, direccion.provincia]
          .filter(Boolean)
          .join(", ")
      : direccion || "No especificada";

  const items = detalle?.items || detalle?.detalles || [];
  const fecha = detalle?.fecha || detalle?.createdAt || "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Detalle del Pedido <span className="font-mono text-primary font-bold">#{idPedido}</span>
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Registrado: {fecha.split("T")[0] || fecha}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <RotateCw className="size-6 animate-spin text-primary" />
            <span className="text-sm">Obteniendo información del pedido…</span>
          </div>
        ) : error ? (
          <div className="my-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        ) : (
          <div className="mt-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Información del Cliente & Envío */}
            <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-muted/30 p-4 border border-border">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="size-3.5" /> Datos del Cliente
                </div>
                <div className="text-sm font-medium text-foreground">
                  {cliente.nombres || detalle?.nombreCliente || "Cliente"}{" "}
                  {cliente.apellidos || ""}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="size-3.5" /> {cliente.email || "-"}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Phone className="size-3.5" /> {cliente.telefono || "No registrado"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> Entrega
                </div>
                <div className="text-sm text-foreground">{direccionTexto}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Estado actual:{" "}
                  <span className="font-semibold text-foreground uppercase">
                    {detalle?.estado || "PENDIENTE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Lista de Llantas Compradas */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Llantas / Productos en la orden ({items.length})
              </div>
              {items.length === 0 ? (
                <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">
                  No hay items listados en este pedido.
                </div>
              ) : (
                <div className="divide-y divide-border rounded-lg border border-border bg-card">
                  {items.map((item, idx) => {
                    const producto = item.producto || {};
                    const modelo = producto.nombre || item.nombre || "Producto";
                    const marca = producto.marca?.nombre || item.marca || "";
                    const medida = producto.medidas?.texto || "";
                    const cantidad = Number(item.cantidad || 1);
                    const precio = Number(item.precioUnitario || item.precio || 0);
                    const subtotal = cantidad * precio;

                    return (
                      <div key={idx} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-md border border-border bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                            <Layers className="size-5" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">
                              {modelo}
                              {marca && !modelo.includes(marca) ? ` · ${marca}` : ""}
                            </div>
                            {medida && (
                              <div className="text-xs text-muted-foreground font-mono">
                                Medida: {medida}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground font-mono">
                              {cantidad} unidad{cantidad > 1 ? "es" : ""} x ${precio.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-sm text-foreground">
                          ${subtotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desglose Financiero */}
            <div className="rounded-lg bg-muted/30 p-4 border border-border space-y-2 text-sm font-mono">
              <div className="flex justify-between font-bold text-base text-foreground">
                <span>Total a Cobrar:</span>
                <span className="text-primary font-bold">
                  ${Number(detalle?.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
