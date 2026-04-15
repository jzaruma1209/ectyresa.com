import { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';

/**
 * Módulo de Reportes del admin.
 * - Ventas por período (tabla simple — gráficas se conectan cuando haya librería)
 * - Productos más vendidos (top)
 * - Estadísticas de carritos
 */
export default function AdminReportes() {
  const [periodo, setPeriodo] = useState('mes');
  const [ventas, setVentas] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [statsCarritos, setStatsCarritos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ventas');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ventasData, topData, carritosData] = await Promise.allSettled([
          adminService.getReporteVentas(periodo),
          adminService.getProductosTop(),
          adminService.getStatsCarritos(),
        ]);

        if (ventasData.status === 'fulfilled') {
          const v = ventasData.value;
          const arr = v?.ventas ?? v?.data ?? v;
          setVentas(Array.isArray(arr) ? arr : []);
        }
        if (topData.status === 'fulfilled') {
          const t = topData.value;
          const arr = t?.productos ?? t?.data ?? t;
          setTopProductos(Array.isArray(arr) ? arr : []);
        }
        if (carritosData.status === 'fulfilled') {
          setStatsCarritos(carritosData.value);
        }
      } catch (err) {
        console.error('Error cargando reportes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [periodo]);

  const formatMoney = (val) => `$${Number(val || 0).toLocaleString('es-CO')}`;

  const tabs = [
    { id: 'ventas', label: '💰 Ventas', icon: '💰' },
    { id: 'top', label: '🏆 Más Vendidos', icon: '🏆' },
    { id: 'carritos', label: '🛒 Carritos', icon: '🛒' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Reportes</h1>
        <p>Estadísticas y métricas del negocio</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 20, borderBottom: '2px solid var(--admin-border)',
        paddingBottom: 0,
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--admin-surface)' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid var(--admin-accent)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /> Cargando reportes…</div>
      ) : (
        <>
          {/* ── TAB: VENTAS ── */}
          {activeTab === 'ventas' && (
            <div>
              <div className="admin-toolbar" style={{ marginBottom: 16 }}>
                <div className="admin-toolbar__left">
                  <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-secondary)' }}>Período:</span>
                  <select
                    className="admin-select"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  >
                    <option value="semana">Última semana</option>
                    <option value="mes">Último mes</option>
                  </select>
                </div>
              </div>

              {ventas.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty__icon">💰</div>
                  <div className="admin-empty__text">No hay datos de ventas disponibles para este período</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', marginTop: 8 }}>
                    Este reporte requiere el endpoint <code>GET /admin/reportes/ventas</code> en el backend
                  </div>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Pedidos</th>
                        <th>Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.map((v, i) => (
                        <tr key={i}>
                          <td>{v.fecha || v.date || '-'}</td>
                          <td>{v.totalPedidos || v.count || 0}</td>
                          <td style={{ fontWeight: 600 }}>{formatMoney(v.ingresos || v.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Barra visual simple de ingresos */}
              {ventas.length > 0 && (
                <div className="admin-card" style={{ marginTop: 20 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 12 }}>
                    Ingresos por día ({periodo})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ventas.map((v, i) => {
                      const max = Math.max(...ventas.map((x) => x.ingresos || x.total || 0));
                      const val = v.ingresos || v.total || 0;
                      const pct = max > 0 ? (val / max) * 100 : 0;
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ minWidth: 70, fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>
                            {v.fecha || v.date || ''}
                          </span>
                          <div style={{
                            flex: 1, height: 22, background: 'var(--admin-bg)', borderRadius: 4, overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${pct}%`, height: '100%',
                              background: 'linear-gradient(90deg, var(--admin-accent), #FF4444)',
                              borderRadius: 4,
                              transition: 'width 0.5s ease-out',
                              minWidth: pct > 0 ? 4 : 0,
                            }} />
                          </div>
                          <span style={{ minWidth: 90, fontSize: '0.78rem', fontWeight: 600, textAlign: 'right' }}>
                            {formatMoney(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: MÁS VENDIDOS ── */}
          {activeTab === 'top' && (
            <div>
              {topProductos.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty__icon">🏆</div>
                  <div className="admin-empty__text">No hay datos de productos más vendidos</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', marginTop: 8 }}>
                    Este reporte requiere el endpoint <code>GET /admin/reportes/productos-top</code> en el backend
                  </div>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Cantidad Vendida</th>
                        <th>Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProductos.map((p, i) => (
                        <tr key={i}>
                          <td style={{
                            fontWeight: 700,
                            color: i < 3 ? 'var(--admin-accent)' : 'var(--admin-text)',
                            fontSize: i < 3 ? '1rem' : '0.88rem',
                          }}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                          </td>
                          <td style={{ fontWeight: 600 }}>{p.modelo || p.nombre || '-'}</td>
                          <td>{p.marca || '-'}</td>
                          <td>{p.cantidadVendida || p.cantidad || 0} unidades</td>
                          <td style={{ fontWeight: 600 }}>
                            {formatMoney(p.ingresosTotales || p.ingresos || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: CARRITOS ── */}
          {activeTab === 'carritos' && (
            <div>
              {!statsCarritos ? (
                <div className="admin-empty">
                  <div className="admin-empty__icon">🛒</div>
                  <div className="admin-empty__text">No hay estadísticas de carritos disponibles</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', marginTop: 8 }}>
                    Este reporte requiere el endpoint <code>GET /admin/stats/carritos</code> en el backend
                  </div>
                </div>
              ) : (
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">🛒</div>
                    <div className="admin-stat-card__info">
                      <div className="admin-stat-card__value">
                        {statsCarritos.activos || 0}
                      </div>
                      <div className="admin-stat-card__label">Carritos activos</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">💨</div>
                    <div className="admin-stat-card__info">
                      <div className="admin-stat-card__value" style={{ color: '#E65100' }}>
                        {statsCarritos.abandonados || 0}
                      </div>
                      <div className="admin-stat-card__label">Carritos abandonados</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="admin-stat-card__icon">✅</div>
                    <div className="admin-stat-card__info">
                      <div className="admin-stat-card__value" style={{ color: '#2E7D32' }}>
                        {statsCarritos.convertidos || 0}
                      </div>
                      <div className="admin-stat-card__label">Convertidos en pedido</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
