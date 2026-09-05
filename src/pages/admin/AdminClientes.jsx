import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Eye, X } from 'lucide-react';
import adminService from '../../services/admin.service';

/**
 * Módulo de gestión de clientes.
 * Lista, busca, activa/suspende y muestra detalle + pedidos de cada cliente.
 */
export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detalle, setDetalle] = useState(null);
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [detalleLoading, setDetalleLoading] = useState(false);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      const data = await adminService.getClientes(params);
      const responseData = data.data || data;
      setClientes(responseData.clientes || responseData || []);
      setTotalPages(responseData.totalPaginas || 1);
    } catch (err) {
      console.error('Error cargando clientes:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClientes();
    }, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchClientes, search]);

  const handleToggle = async (id) => {
    try {
      await adminService.toggleClienteStatus(id);
      fetchClientes();
    } catch (err) {
      alert('Error al cambiar estado del cliente');
    }
  };

  const handleVerDetalle = async (id) => {
    try {
      setDetalleLoading(true);
      const [clienteData, pedidosData] = await Promise.all([
        adminService.getClienteById(id),
        adminService.getClientePedidos(id).catch(() => []),
      ]);
      setDetalle(clienteData);
      setDetallePedidos(pedidosData.pedidos || pedidosData || []);
    } catch (err) {
      alert('Error al cargar detalle del cliente');
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

  return (
    <div>
      <div className="admin-page-header">
        <h1>Clientes</h1>
        <p>Usuarios registrados en la tienda</p>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar__left">
          <div className="admin-search">
            <span className="admin-search__icon">
              <Search size={14} strokeWidth={1.75} />
            </span>
            <input
              className="admin-search__input"
              type="text"
              placeholder="Buscar por nombre o email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
          Cargando clientes…
        </div>
      ) : clientes.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">
            <Users size={24} strokeWidth={1.75} />
          </div>
          <div className="admin-empty__text">
            {search ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id || c.idCliente}>
                    <td style={{ fontWeight: 600 }}>
                      {c.nombres || c.nombre || '-'} {c.apellidos || ''}
                    </td>
                    <td>{c.email}</td>
                    <td className="font-mono">{c.telefono || '-'}</td>
                    <td>
                      <span
                        className={`admin-status ${
                          c.activo !== false
                            ? 'admin-status--confirmado'
                            : 'admin-status--cancelado'
                        }`}
                      >
                        {c.activo !== false ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td>{formatDate(c.createdAt || c.fechaRegistro)}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                        onClick={() => handleVerDetalle(c.id || c.idCliente)}
                      >
                        <Eye size={16} strokeWidth={1.75} /> Ver
                      </button>
                      <button
                        className={`admin-btn admin-btn--sm ${
                          c.activo !== false ? 'admin-btn--danger' : 'admin-btn--primary'
                        }`}
                        onClick={() => handleToggle(c.id || c.idCliente)}
                      >
                        {c.activo !== false ? 'Suspender' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        <div className="admin-modal-overlay" onClick={() => { setDetalle(null); setDetallePedidos([]); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="admin-modal__header">
              <h2>Cliente: {detalle.nombres || detalle.nombre} {detalle.apellidos || ''}</h2>
              <button className="admin-modal__close" onClick={() => { setDetalle(null); setDetallePedidos([]); }} aria-label="Cerrar">
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
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Email</div>
                      <div>{detalle.email}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Teléfono</div>
                      <div>{detalle.telefono || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Identificación</div>
                      <div>{detalle.tipoIdentificacion || ''} {detalle.numeroIdentificacion || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Estado</div>
                      <span className={`admin-status ${detalle.activo !== false ? 'admin-status--confirmado' : 'admin-status--cancelado'}`}>
                        {detalle.activo !== false ? 'Activo' : 'Suspendido'}
                      </span>
                    </div>
                  </div>

                  {detallePedidos.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>
                        Historial de pedidos ({detallePedidos.length})
                      </div>
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Fecha</th>
                              <th>Total</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detallePedidos.map((p) => (
                              <tr key={p.id || p.idPedido}>
                                <td className="font-mono">#{p.id || p.idPedido}</td>
                                <td>{formatDate(p.fecha || p.createdAt)}</td>
                                <td className="font-mono" style={{ fontWeight: 600 }}>${Number(p.total || 0).toLocaleString('es-CO')}</td>
                                <td>
                                  <span className={`admin-status admin-status--${(p.estado || '').toLowerCase()}`}>
                                    {p.estado}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {detallePedidos.length === 0 && (
                    <div style={{ fontSize: '0.88rem', color: 'var(--admin-text-secondary)', textAlign: 'center', padding: 20 }}>
                      Este cliente aún no tiene pedidos
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
