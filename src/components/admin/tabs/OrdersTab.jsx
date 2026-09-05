import { Search, Eye, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";

export function OrdersTab({
  orders,
  orderSearchQuery,
  onOrderSearchChange,
  orderStatusFilter,
  onOrderStatusFilterChange,
  onChangeOrderStatus,
  onOpenOrderDetailModal,
}) {
  const statusConfig = {
    pending: { label: "Pendiente", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    processing: { label: "Procesando", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    shipped: { label: "Enviado", color: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
    delivered: { label: "Entregado", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    cancelled: { label: "Cancelado", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus =
      orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por cliente o código ORD..."
              value={orderSearchQuery}
              onChange={(e) => onOrderSearchChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <select
            value={orderStatusFilter}
            onChange={(e) => onOrderStatusFilterChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesando</option>
            <option value="shipped">Enviados</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* ── Tabla de Órdenes ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Nº Orden</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado (Cambio rápido)</th>
                <th className="px-4 py-3 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground">
                    No se encontraron órdenes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{order.customer.name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {order.createdAt}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => onChangeOrderStatus(order.id, e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenOrderDetailModal(order)}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Ver detalle del pedido"
                        >
                          <Eye className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
