import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight, Clock, CheckCircle2, AlertTriangle, XCircle, Truck } from "lucide-react";

export function DashboardTab({ stats, orders, onNavigateTab }) {
  const kpiCards = [
    {
      title: "Ingresos Totales",
      value: `$ ${stats.totalRevenue.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`,
      subtext: "+14.2% respecto al mes anterior",
      icon: DollarSign,
    },
    {
      title: "Total Pedidos",
      value: stats.totalOrdersCount,
      subtext: `${stats.pendingOrdersCount} pedidos pendientes de atención`,
      icon: ShoppingCart,
    },
    {
      title: "Total Clientes",
      value: stats.totalUsersCount,
      subtext: "Registrados en la plataforma",
      icon: Users,
    },
    {
      title: "Productos Activos",
      value: stats.totalProductsCount,
      subtext: `${stats.lowStockCount} con stock bajo`,
      icon: Package,
    },
  ];

  const statusConfig = {
    pending: { label: "Pendientes", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: Clock },
    processing: { label: "Procesando", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Truck },
    shipped: { label: "Enviados", color: "bg-sky-500/15 text-sky-400 border-sky-500/30", icon: Truck },
    delivered: { label: "Entregados", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
    cancelled: { label: "Cancelados", color: "bg-rose-500/15 text-rose-400 border-rose-500/30", icon: XCircle },
  };

  return (
    <div className="space-y-6">
      {/* ── Grid 4 KPIs ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xs transition-colors hover:border-border/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{kpi.title}</span>
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold font-mono tracking-tight">{kpi.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{kpi.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filas Secundarias: Pedidos Recientes & Estados ── */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Pedidos Recientes (Colspan 4) */}
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs lg:col-span-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground text-base">Pedidos Recientes</h3>
              <p className="text-xs text-muted-foreground">Últimas órdenes registradas en la tienda</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("orders")}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Ver todas <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border">
            {orders.slice(0, 5).map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="flex items-center justify-between py-3.5 first:pt-4 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground text-xs font-semibold uppercase">
                      {order.customer.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{order.orderNumber} • {order.createdAt}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-sm text-foreground">
                      ${order.total.toFixed(2)}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen por Estado (Colspan 3) */}
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs lg:col-span-3">
          <div className="pb-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-base">Estado de Pedidos</h3>
            <p className="text-xs text-muted-foreground">Distribución actual de las órdenes</p>
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(statusConfig).map(([key, config]) => {
              const count = orders.filter((o) => o.status === key).length;
              const Icon = config.icon;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{config.label}</span>
                  </div>
                  <span className={`inline-flex items-center font-mono rounded-md border px-2.5 py-0.5 text-xs font-bold ${config.color}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
