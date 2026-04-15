import { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin.service';

/**
 * Módulo de Inventario.
 * Vista enfocada en stock: ordenada de menor a mayor,
 * con indicadores visuales y edición rápida de stock inline.
 */
export default function AdminInventario() {
  const [llantas, setLlantas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLlantas = useCallback(async () => {
    try {
      setLoading(true);
      // Traer todas las llantas (sin paginación si es posible, o con limite alto)
      const data = await adminService.getLlantas({ page: 1, limit: 200 });
      const responseData = data.data || data;
      let items = responseData.llantas || responseData || [];
      // Ordenar por stock de menor a mayor
      items = [...items].sort((a, b) => (a.stock || 0) - (b.stock || 0));
      setLlantas(items);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLlantas(); }, [fetchLlantas]);

  const getStockClass = (stock) => {
    if (stock === 0) return 'stock-out';
    if (stock <= 10) return 'stock-low';
    return 'stock-ok';
  };

  const getStockIndicator = (stock) => {
    if (stock === 0) return '🔴';
    if (stock <= 10) return '🟡';
    return '🟢';
  };

  const handleEditStart = (llanta) => {
    setEditingId(llanta.id || llanta.idLlanta);
    setEditValue(String(llanta.stock || 0));
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleEditSave = async (llanta) => {
    const newStock = parseInt(editValue, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert('Ingresa un valor de stock válido (≥ 0)');
      return;
    }

    try {
      setSaving(true);
      // Intentar endpoint dedicado primero, fallback al PUT general
      try {
        await adminService.updateStock(llanta.id || llanta.idLlanta, newStock);
      } catch {
        await adminService.updateLlanta(llanta.id || llanta.idLlanta, {
          ...llanta,
          stock: newStock,
        });
      }
      setEditingId(null);
      setEditValue('');
      fetchLlantas();
    } catch (err) {
      alert('Error al actualizar stock: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e, llanta) => {
    if (e.key === 'Enter') handleEditSave(llanta);
    if (e.key === 'Escape') handleEditCancel();
  };

  // Resumen de inventario
  const totalItems = llantas.length;
  const outOfStock = llantas.filter((l) => (l.stock || 0) === 0).length;
  const lowStock = llantas.filter((l) => (l.stock || 0) > 0 && (l.stock || 0) <= 10).length;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Inventario</h1>
        <p>Control de stock — ordenado de menor a mayor disponibilidad</p>
      </div>

      {/* Resumen rápido */}
      <div className="admin-stats-grid" style={{ marginBottom: 20 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">📦</div>
          <div className="admin-stat-card__info">
            <div className="admin-stat-card__value">{totalItems}</div>
            <div className="admin-stat-card__label">Productos totales</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">🔴</div>
          <div className="admin-stat-card__info">
            <div className="admin-stat-card__value" style={{ color: '#C62828' }}>{outOfStock}</div>
            <div className="admin-stat-card__label">Agotados</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">🟡</div>
          <div className="admin-stat-card__info">
            <div className="admin-stat-card__value" style={{ color: '#E65100' }}>{lowStock}</div>
            <div className="admin-stat-card__label">Stock bajo (≤10)</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /> Cargando inventario…</div>
      ) : llantas.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">📊</div>
          <div className="admin-empty__text">No hay productos en el inventario</div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Producto</th>
                <th>Marca</th>
                <th>Medida</th>
                <th>Stock Actual</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {llantas.map((ll) => {
                const id = ll.id || ll.idLlanta;
                const isEditing = editingId === id;

                return (
                  <tr key={id} style={ll.stock === 0 ? { background: '#FFF5F5' } : {}}>
                    <td style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {getStockIndicator(ll.stock || 0)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{ll.modelo}</td>
                    <td>{ll.marca?.nombre || ll.nombreMarca || '-'}</td>
                    <td>{ll.ancho}/{ll.perfil} R{ll.rin}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, ll)}
                          autoFocus
                          style={{
                            width: 80, padding: '6px 8px', border: '2px solid var(--admin-accent)',
                            borderRadius: 4, fontSize: '0.88rem', fontWeight: 700, textAlign: 'center',
                          }}
                        />
                      ) : (
                        <span className={getStockClass(ll.stock || 0)} style={{ fontSize: '1rem' }}>
                          {ll.stock ?? 0}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="admin-btn admin-btn--primary admin-btn--sm"
                            onClick={() => handleEditSave(ll)}
                            disabled={saving}
                          >
                            {saving ? '…' : '✓ Guardar'}
                          </button>
                          <button
                            className="admin-btn admin-btn--secondary admin-btn--sm"
                            onClick={handleEditCancel}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className="admin-btn admin-btn--secondary admin-btn--sm"
                          onClick={() => handleEditStart(ll)}
                        >
                          ✏️ Editar stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
