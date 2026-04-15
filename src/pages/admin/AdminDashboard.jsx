import { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';

/**
 * Dashboard principal del admin.
 * Muestra las 4 métricas clave del negocio desde GET /admin/dashboard
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboard();
        // Backend: { success, data: { ventas, pedidos, clientes, productosMasVendidos, stockBajo } }
        const payload = res?.data ?? res;
        setStats(payload);
      } catch (err) {
        setError('No se pudieron cargar las métricas. Verifica la conexión.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        Cargando métricas…
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-empty">
        <div className="admin-empty__icon">⚠️</div>
        <div className="admin-empty__text">{error}</div>
      </div>
    );
  }

  // Calcular pedidos pendientes desde el array porEstado
  const porEstado = stats?.pedidos?.porEstado ?? [];
  const pendienteCount = Number(porEstado.find((e) => e.estado === 'PENDIENTE')?.total ?? 0);
  const totalPedidosCount = porEstado.reduce((acc, e) => acc + Number(e.total), 0);

  const cards = [
    { icon: '👥', value: stats?.clientes?.total ?? 0, label: 'Total Clientes' },
    { icon: '📦', value: totalPedidosCount, label: 'Total Pedidos' },
    { icon: '⏳', value: pendienteCount, label: 'Pedidos Pendientes' },
    {
      icon: '💰',
      value: `$${(stats?.ventas?.mes ?? 0).toLocaleString('es-CO')}`,
      label: 'Ingresos del Mes',
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Resumen general del negocio</p>
      </div>

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-card__icon">{card.icon}</div>
            <div className="admin-stat-card__info">
              <div className="admin-stat-card__value">{card.value}</div>
              <div className="admin-stat-card__label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: 8 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: 'var(--admin-text)' }}>
          Resumen rápido
        </h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--admin-text-secondary)' }}>
          Usa el menú lateral para gestionar pedidos, clientes, productos, inventario y reportes.
        {stats?.pedidosPendientes > 0 || pendienteCount > 0 ? (
            <span style={{ color: 'var(--admin-accent)', fontWeight: 600 }}>
              {' '}Tienes {pendienteCount} pedido{pendienteCount !== 1 ? 's' : ''} esperando atención.
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
