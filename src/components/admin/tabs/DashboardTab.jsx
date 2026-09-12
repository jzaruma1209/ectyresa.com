import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  RotateCw,
} from "lucide-react";
import adminService from "@/services/admin.service";

export function DashboardTab({ onNavigateTab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getDashboard();
      const payload = res?.data ?? res;
      setData(payload);
    } catch (err) {
      console.error("Error al cargar dashboard admin:", err);
      setError("No se pudieron cargar las métricas en tiempo real.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Mapeo y cálculo de estados de órdenes desde el backend
  const porEstado = data?.pedidos?.porEstado ?? [];
  const pendientesCount = Number(
    porEstado.find((e) => e.estado === "PENDIENTE")?.total ?? 0
  );
  const totalPedidos = porEstado.reduce((acc, e) => acc + Number(e.total || 0), 0);

  const totalIngresos = Number(data?.ventas?.mes ?? data?.ventas?.total ?? 0);
  const totalClientes = Number(data?.clientes?.total ?? 0);
  const stockBajo = Number(data?.stockBajo?.length ?? data?.stockBajo ?? 0);

  const kpiCards = [
    {
      title: "Ingresos del Mes",
      value: `$ ${totalIngresos.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`,
      subtext: "Ventas acumuladas este mes",
      icon: DollarSign,
    },
    {
      title: "Total Pedidos",
      value: totalPedidos,
      subtext: `${pendientesCount} órdenes pendientes de atención`,
      icon: ShoppingCart,
    },
    {
      title: "Clientes Registrados",
      value: totalClientes,
      subtext: "Base de usuarios en la plataforma",
      icon: Users,
    },
    {
      title: "Alertas de Inventario",
      value: stockBajo,
      subtext: "Productos con bajo stock o agotados",
      icon: Package,
    },
  ];

  const statusConfig = {
    PENDIENTE: {
      label: "Pendiente",
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    CONFIRMADO: {
      label: "Confirmado",
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      icon: Truck,
    },
    EN_PREPARACION: {
      label: "En Preparación",
      color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      icon: Truck,
    },
    ENVIADO: {
      label: "Enviado",
      color: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      icon: Truck,
    },
    ENTREGADO: {
      label: "Entregado",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: CheckCircle2,
    },
    CANCELADO: {
      label: "Cancelado",
      color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      icon: XCircle,
    },
  };

  const pedidosRecientes = data?.pedidos?.recientes || [];

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
        <RotateCw className="size-6 animate-spin text-primary" />
        <span className="text-sm">Cargando métricas del panel…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón de refrescar y alerta si hubo error */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchDashboard}
            className="flex items-center gap-1 text-xs font-semibold underline hover:text-amber-300"
          >
            Reintentar <RotateCw className="size-3" />
          </button>
        </div>
      )}

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
                <span className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </span>
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
                  {kpi.value}
                </div>
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
              <h3 className="font-semibold text-foreground text-base">
                Pedidos Recientes
              </h3>
              <p className="text-xs text-muted-foreground">
                Órdenes más recientes registradas en la tienda
              </p>
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
            {pedidosRecientes.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No hay órdenes registradas recientemente.
              </div>
            ) : (
              pedidosRecientes.slice(0, 5).map((order) => {
                const statusKey = (order.estado || "PENDIENTE").toUpperCase();
                const status = statusConfig[statusKey] || statusConfig.PENDIENTE;
                const clienteNombre =
                  order.cliente?.nombres || order.nombreCliente || "Cliente";
                const totalPedido = Number(order.total || 0);
                const fecha = order.fecha || order.createdAt || "-";

                return (
                  <div
                    key={order.id || order.idPedido}
                    className="flex items-center justify-between py-3.5 first:pt-4 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground text-xs font-semibold uppercase">
                        {clienteNombre.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {clienteNombre} {order.cliente?.apellidos || ""}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          #{order.id || order.idPedido} •{" "}
                          {fecha.split("T")[0] || fecha}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-sm text-foreground">
                        ${totalPedido.toFixed(2)}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Resumen por Estado (Colspan 3) */}
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xs lg:col-span-3">
          <div className="pb-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-base">
              Estado de Pedidos
            </h3>
            <p className="text-xs text-muted-foreground">
              Distribución de pedidos por fase de atención
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {Object.entries(statusConfig).map(([key, config]) => {
              const item = porEstado.find(
                (e) => (e.estado || "").toUpperCase() === key
              );
              const count = item ? Number(item.total || 0) : 0;
              const Icon = config.icon;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/50"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {config.label}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center font-mono rounded-md border px-2.5 py-0.5 text-xs font-bold ${config.color}`}
                  >
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
