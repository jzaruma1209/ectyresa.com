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
        const data = await adminService.getDashboard();
        setStats(data);
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

  const cards = [
    { icon: '👥', value: stats?.totalClientes ?? 0, label: 'Total Clientes' },
    { icon: '📦', value: stats?.totalPedidos ?? 0, label: 'Total Pedidos' },
    {
      icon: '⏳',
      value: stats?.pedidosPendientes ?? 0,
      label: 'Pedidos Pendientes',
    },
    {
      icon: '💰',
      value: `$${(stats?.ingresosMes ?? 0).toLocaleString('es-CO')}`,
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
          {stats?.pedidosPendientes > 0 && (
            <span style={{ color: 'var(--admin-accent)', fontWeight: 600 }}>
              {' '}Tienes {stats.pedidosPendientes} pedido{stats.pedidosPendientes !== 1 ? 's' : ''} esperando atención.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
