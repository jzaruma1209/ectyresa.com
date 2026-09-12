import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Pencil, Power, AlertTriangle, RotateCw, Layers } from "lucide-react";
import adminService from "@/services/admin.service";
import nivelesService, { mensajeError } from "@/services/niveles.service";

export function ProductsTab({
  onOpenNewProductModal,
  onOpenEditProductModal,
  onDeleteProduct,
  refreshTrigger = 0,
}) {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    nivelesService
      .getNiveles()
      .then((data) => setTipos(data.tiposProducto || []))
      .catch(() => setTipos([]));
  }, []);

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 15, estado: filtroEstado };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filtroTipo) params.idTipoProducto = filtroTipo;
      const res = await adminService.getProductos(params);
      const payload = res?.data ?? {};
      setProductos(payload.productos || []);
      setTotalPages(payload.totalPaginas || 1);
      setTotal(payload.total || 0);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudo cargar el catálogo de productos.");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, filtroTipo, filtroEstado]);

  useEffect(() => {
    const timer = setTimeout(fetchProductos, searchQuery ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchProductos, searchQuery, refreshTrigger]);

  const reactivar = async (producto) => {
    try {
      await adminService.cambiarEstadoProducto(producto.idProducto, true);
      fetchProductos();
    } catch (err) {
      alert(mensajeError(err, "No se pudo activar el producto"));
    }
  };

  const selectClass =
    "h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer";

  return (
    <div className="space-y-4">
      {/* ── Toolbar: Buscador, filtros y Botón Nuevo ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca, modelo o medida (225/75R15)…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t.idTipoProducto} value={t.idTipoProducto}>
                {t.nombre}
              </option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProductos}
            disabled={loading}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Recargar productos"
          >
            <RotateCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onOpenNewProductModal}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">{error}</div>
      )}

      {/* ── Tabla de Productos ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Marca</th>
                <th className="px-4 py-3">Modelo / Medida</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="size-5 animate-spin text-primary" />
                      <span>Cargando productos de la base de datos…</span>
                    </div>
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-muted-foreground">
                    No se encontraron productos registrados.
                  </td>
                </tr>
              ) : (
                productos.map((producto) => {
                  const stock = Number(producto.stock) || 0;
                  const agotado = stock === 0;
                  const stockBajo = !agotado && stock <= 5;
                  return (
                    <tr
                      key={producto.idProducto}
                      className={`hover:bg-muted/30 transition-colors ${producto.activo ? "" : "opacity-60"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {producto.imagenPrincipal ? (
                            <img
                              src={producto.imagenPrincipal}
                              alt={producto.nombre}
                              className="size-11 rounded-lg object-cover border border-border bg-muted shrink-0"
                            />
                          ) : (
                            <div className="size-11 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              <Layers className="size-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-foreground">{producto.nombre}</div>
                            <div className="text-xs text-muted-foreground">
                              Cod: #{producto.idProducto} · {producto.imagenes.length}/5 fotos
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{producto.tipoProducto?.nombre}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{producto.marca?.nombre}</td>
                      <td className="px-4 py-3 text-xs">
                        {producto.modelo || producto.medidas ? (
                          <div className="space-y-1">
                            {producto.modelo && <div className="font-medium text-foreground">{producto.modelo.nombre}</div>}
                            {producto.medidas && (
                              <span className="rounded bg-muted px-2 py-0.5 font-mono font-semibold text-foreground">
                                {producto.medidas.texto}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-foreground">${Number(producto.precio).toFixed(2)}</div>
                        {producto.precioAnterior && (
                          <div className="text-[11px] text-muted-foreground line-through">
                            ${Number(producto.precioAnterior).toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${agotado || stockBajo ? "text-rose-400" : "text-foreground"}`}>
                            {stock}
                          </span>
                          {(agotado || stockBajo) && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400">
                              <AlertTriangle className="size-3" /> {agotado ? "Agotado" : "Bajo"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {producto.activo ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenEditProductModal(producto)}
                            className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Editar producto"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => (producto.activo ? onDeleteProduct(producto) : reactivar(producto))}
                            className={`flex size-8 items-center justify-center rounded-md border border-border transition-colors ${
                              producto.activo
                                ? "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                : "hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400"
                            }`}
                            title={producto.activo ? "Desactivar producto" : "Activar producto"}
                          >
                            <Power className="size-3.5" />
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
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {total} producto(s) · Página {page} de {totalPages}
          </span>
          {totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
