import { useState, useEffect, useCallback } from "react";
import { Search, Users, Eye, X, RotateCw, UserCheck, UserX } from "lucide-react";
import adminService from "@/services/admin.service";

export function UsersTab() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clientePedidos, setClientePedidos] = useState([]);
  const [togglingId, setTogglingId] = useState(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 15 };
      if (search.trim()) params.search = search.trim();
      const res = await adminService.getClientes(params);
      const payload = res?.data ?? res;
      setClientes(payload?.clientes || (Array.isArray(payload) ? payload : []));
      setTotalPages(payload?.totalPaginas || payload?.totalPages || 1);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
      setError("No se pudieron cargar los clientes.");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClientes();
    }, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchClientes, search]);

  const handleToggle = async (id) => {
    try {
      setTogglingId(id);
      await adminService.toggleClienteStatus(id);
      setClientes((prev) =>
        prev.map((c) => {
          const cId = c.id || c.idCliente;
          if (cId === id) {
            return { ...c, activo: c.activo === false ? true : false };
          }
          return c;
        })
      );
    } catch (err) {
      alert("Error al cambiar estado del cliente: " + (err.response?.data?.message || err.message));
    } finally {
      setTogglingId(null);
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      const [clienteData, pedidosData] = await Promise.all([
        adminService.getClienteById(id),
        adminService.getClientePedidos(id).catch(() => []),
      ]);
      setSelectedCliente(clienteData?.data || clienteData);
      setClientePedidos(pedidosData?.data?.pedidos || pedidosData?.pedidos || pedidosData || []);
    } catch (err) {
      console.error("Error al cargar detalle del cliente:", err);
      alert("Error al cargar la información del cliente.");
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cliente por nombre o email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <button
          type="button"
          onClick={fetchClientes}
          disabled={loading}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Recargar lista"
        >
          <RotateCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* ── Tabla de Clientes ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha Registro</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="size-5 animate-spin text-primary" />
                      <span>Cargando clientes de la base de datos…</span>
                    </div>
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="size-6 text-muted-foreground" />
                      <span>No se encontraron clientes registrados.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => {
                  const id = cliente.id || cliente.idCliente;
                  const nombre = `${cliente.nombres || cliente.nombre || "Usuario"} ${cliente.apellidos || ""}`.trim();
                  const activo = cliente.activo !== false;
                  const fecha = cliente.createdAt || cliente.fechaRegistro || "-";

                  return (
                    <tr key={id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                            {nombre.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{nombre}</div>
                            <div className="text-xs text-muted-foreground">{cliente.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {cliente.telefono || "No registrado"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            activo
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {activo ? "Activo" : "Suspendido"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {fecha.split("T")[0] || fecha}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerDetalle(id)}
                            className="inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Ver perfil e historial"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            disabled={togglingId === id}
                            onClick={() => handleToggle(id)}
                            className={`inline-flex h-8 items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors ${
                              activo
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                            title={activo ? "Suspender acceso" : "Reactivar acceso"}
                          >
                            {activo ? (
                              <>
                                <UserX className="size-3.5" />
                                <span>Suspender</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-3.5" />
                                <span>Activar</span>
                              </>
                            )}
                          </button>
                        </div>
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

      {/* Modal de Detalle del Cliente */}
      {selectedCliente && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          onClick={() => setSelectedCliente(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedCliente.nombres || selectedCliente.nombre} {selectedCliente.apellidos || ""}
                </h3>
                <p className="text-xs text-muted-foreground">Detalle del cliente y pedidos</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCliente(null)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-muted/30 p-3 border border-border text-xs">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <div className="font-medium text-foreground mt-0.5">{selectedCliente.email}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Teléfono:</span>
                  <div className="font-medium text-foreground mt-0.5">{selectedCliente.telefono || "No especificado"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Identificación:</span>
                  <div className="font-medium text-foreground mt-0.5">
                    {selectedCliente.tipoIdentificacion || ""} {selectedCliente.numeroIdentificacion || "-"}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado:</span>
                  <div className="mt-0.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        selectedCliente.activo !== false
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {selectedCliente.activo !== false ? "Activo" : "Suspendido"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Historial de Pedidos ({clientePedidos.length})
                </h4>
                {clientePedidos.length === 0 ? (
                  <div className="rounded-lg border border-border p-4 text-center text-xs text-muted-foreground">
                    Este cliente aún no registra pedidos.
                  </div>
                ) : (
                  <div className="divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
                    {clientePedidos.map((p) => (
                      <div key={p.id || p.idPedido} className="flex items-center justify-between p-3 text-xs">
                        <div>
                          <div className="font-mono font-bold text-foreground">#{p.id || p.idPedido}</div>
                          <div className="text-muted-foreground">
                            {(p.fecha || p.createdAt || "").split("T")[0]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-foreground">
                            ${Number(p.total || 0).toFixed(2)}
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {p.estado}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCliente(null)}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
