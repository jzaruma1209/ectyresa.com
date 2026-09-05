import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Eye, X } from 'lucide-react';
import adminService from '../../services/admin.service';

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'EN_PREPARACION', label: 'En Preparación' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

const ESTADO_OPTIONS = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

/**
 * Módulo de gestión de pedidos para el admin.
 * Lista, filtra por estado y permite cambiar el estado de cada pedido.
 */
export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detalle, setDetalle] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filtroEstado) params.estado = filtroEstado;
      // El backend responde: { success, data: { pedidos: [], total, totalPaginas } }
      const res = await adminService.getPedidos(params);
      const payload = res?.data ?? res;
      setPedidos(Array.isArray(payload?.pedidos) ? payload.pedidos : []);
      setTotalPages(payload?.totalPaginas || payload?.totalPages || 1);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [page, filtroEstado]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await adminService.updateEstadoPedido(pedidoId, nuevoEstado);
      fetchPedidos();
    } catch (err) {
      alert('Error al cambiar el estado: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      setDetalleLoading(true);
      const data = await adminService.getPedidoById(id);
      setDetalle(data);
    } catch (err) {
      alert('Error al cargar detalle del pedido');
      console.error(err);
    } finally {
      setDetalleLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const formatMoney = (val) => {
    return `$${Number(val || 0).toLocaleString('es-CO')}`;
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Pedidos</h1>
        <p>Gestión de órdenes y seguimiento de envíos</p>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar__left">
          <select
            className="admin-select"
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value); setPage(1); }}
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
          Cargando pedidos…
        </div>
      ) : pedidos.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">
            <ShoppingCart size={24} strokeWidth={1.75} />
          </div>
          <div className="admin-empty__text">No hay pedidos para mostrar</div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Cambiar Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id || p.idPedido} className={p.estado === 'PENDIENTE' ? 'row-pending' : ''}>
                    <td className="font-mono" style={{ fontWeight: 600 }}>#{p.id || p.idPedido}</td>
                    <td>{p.cliente?.nombres || p.nombreCliente || '-'} {p.cliente?.apellidos || ''}</td>
                    <td>{formatDate(p.fecha || p.createdAt)}</td>
                    <td className="font-mono" style={{ fontWeight: 600 }}>{formatMoney(p.total)}</td>
                    <td>
                      <span className={`admin-status admin-status--${(p.estado || '').toLowerCase()}`}>
                        {p.estado || '-'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={p.estado}
                        onChange={(e) => handleCambiarEstado(p.id || p.idPedido, e.target.value)}
                        style={{ fontSize: '0.8rem', padding: '6px 28px 6px 10px' }}
                      >
                        {ESTADO_OPTIONS.map((est) => (
                          <option key={est} value={est}>{est.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                        onClick={() => handleVerDetalle(p.id || p.idPedido)}
                      >
                        <Eye size={16} strokeWidth={1.75} /> Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                Math.max(0, page - 3), page + 2
              ).map((p) => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente →</button>
            </div>
          )}
        </>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div className="admin-modal-overlay" onClick={() => setDetalle(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="admin-modal__header">
              <h2 className="font-mono">Pedido #{detalle.id || detalle.idPedido}</h2>
              <button className="admin-modal__close" onClick={() => setDetalle(null)} aria-label="Cerrar">
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <div className="admin-modal__body">
              {detalleLoading ? (
                <div className="admin-loading"><div className="admin-spinner" /></div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Cliente</div>
                      <div style={{ fontWeight: 600 }}>{detalle.cliente?.nombres || '-'} {detalle.cliente?.apellidos || ''}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Estado</div>
                      <span className={`admin-status admin-status--${(detalle.estado || '').toLowerCase()}`}>
                        {detalle.estado}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Fecha</div>
                      <div>{formatDate(detalle.fecha || detalle.createdAt)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Total</div>
                      <div className="font-mono" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatMoney(detalle.total)}</div>
                    </div>
                  </div>

                  {detalle.direccion && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', marginBottom: 4 }}>Dirección de entrega</div>
                      <div style={{ fontSize: '0.88rem' }}>
                        {detalle.direccion.direccion || detalle.direccion}
                      </div>
                    </div>
                  )}

                  {(detalle.items || detalle.detalles || []).length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>Productos</div>
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cant.</th>
                              <th>Precio</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(detalle.items || detalle.detalles || []).map((item, i) => (
                              <tr key={i}>
                                <td>{item.llanta?.modelo || item.nombre || '-'}</td>
                                <td className="font-mono">{item.cantidad}</td>
                                <td className="font-mono">{formatMoney(item.precioUnitario || item.precio)}</td>
                                <td className="font-mono" style={{ fontWeight: 600 }}>
                                  {formatMoney((item.precioUnitario || item.precio) * item.cantidad)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
