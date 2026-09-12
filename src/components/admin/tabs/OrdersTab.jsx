import { useState, useEffect, useCallback } from "react";
import { Search, Eye, RotateCw, ShoppingCart } from "lucide-react";
import adminService from "@/services/admin.service";

const ESTADOS = [
  { value: "all", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendientes" },
  { value: "CONFIRMADO", label: "Confirmados" },
  { value: "EN_PREPARACION", label: "En Preparación" },
  { value: "ENVIADO", label: "Enviados" },
  { value: "ENTREGADO", label: "Entregados" },
  { value: "CANCELADO", label: "Cancelados" },
];

const ESTADO_OPTIONS = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const statusConfig = {
  PENDIENTE: {
    label: "Pendiente",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  EN_PREPARACION: {
    label: "En Preparación",
    color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  },
  ENVIADO: {
    label: "Enviado",
    color: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  },
  ENTREGADO: {
    label: "Entregado",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  },
};

export function OrdersTab({ onOpenOrderDetailModal }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 15 };
      if (filtroEstado !== "all") {
        params.estado = filtroEstado;
      }
      const res = await adminService.getPedidos(params);
      const payload = res?.data ?? res;
      setPedidos(Array.isArray(payload?.pedidos) ? payload.pedidos : []);
      setTotalPages(payload?.totalPaginas || payload?.totalPages || 1);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [page, filtroEstado]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await adminService.updateEstadoPedido(orderId, newStatus);
      // Actualizar estado local inmediatamente
      setPedidos((prev) =>
        prev.map((p) =>
          (p.id || p.idPedido) === orderId ? { ...p, estado: newStatus } : p
        )
      );
    } catch (err) {
      alert("Error al actualizar estado del pedido: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = pedidos.filter((o) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const idStr = String(o.id || o.idPedido || "");
    const nombre = (o.cliente?.nombres || o.nombreCliente || "").toLowerCase();
    const email = (o.cliente?.email || o.email || "").toLowerCase();
    return idStr.includes(query) || nombre.includes(query) || email.includes(query);
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
              placeholder="Buscar por cliente o nº pedido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={fetchPedidos}
          disabled={loading}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Recargar pedidos"
        >
          <RotateCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
          {error}
        </div>
      )}

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
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Cambiar Estado</th>
                <th className="px-4 py-3 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="size-5 animate-spin text-primary" />
                      <span>Cargando pedidos de la base de datos…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingCart className="size-6 text-muted-foreground" />
                      <span>No se encontraron pedidos.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const id = order.id || order.idPedido;
                  const statusKey = (order.estado || "PENDIENTE").toUpperCase();
                  const status = statusConfig[statusKey] || statusConfig.PENDIENTE;
                  const clienteNombre =
                    order.cliente?.nombres || order.nombreCliente || "Cliente";
                  const clienteEmail = order.cliente?.email || order.email || "-";
                  const fecha = order.fecha || order.createdAt || "-";
                  const isPending = statusKey === "PENDIENTE";

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isPending ? "bg-amber-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        #{id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {clienteNombre} {order.cliente?.apellidos || ""}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {clienteEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {fecha.split("T")[0] || fecha}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        ${Number(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          disabled={updatingId === id}
                          value={statusKey}
                          onChange={(e) => handleChangeStatus(id, e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        >
                          {ESTADO_OPTIONS.map((est) => (
                            <option key={est} value={est}>
                              {est.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenOrderDetailModal(id)}
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
