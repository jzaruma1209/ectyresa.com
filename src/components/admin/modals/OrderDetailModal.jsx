import { X, MapPin, Phone, Mail, User, CreditCard } from "lucide-react";

export function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Detalle del Pedido <span className="font-mono text-primary font-bold">{order.orderNumber}</span>
            </h3>
            <p className="text-xs text-muted-foreground font-mono">{order.createdAt}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Información del Cliente & Envío */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-lg bg-muted/40 p-4 border border-border">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="size-3.5" /> Datos del Cliente
              </div>
              <div className="text-sm font-medium text-foreground">{order.customer.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="size-3" /> {order.customer.email}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Phone className="size-3" /> {order.customer.phone || "No especificado"}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="size-3.5" /> Dirección de Entrega
              </div>
              <div className="text-sm text-foreground">{order.shippingAddress.address}</div>
              <div className="text-xs text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.zipCode})
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <CreditCard className="size-3" /> Método: <span className="font-mono font-medium text-foreground">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Lista de Materiales Comprados */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Materiales Despachados ({order.items.length})
            </div>
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=64&h=64&fit=crop"}
                      alt={item.name}
                      className="size-11 rounded-md object-cover border border-border bg-muted"
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-foreground">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desglose Financiero */}
          <div className="rounded-lg bg-muted/40 p-4 border border-border space-y-2 text-sm font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Costo de Envío:</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-foreground border-t border-border pt-2">
              <span>Total Pagado:</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

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
