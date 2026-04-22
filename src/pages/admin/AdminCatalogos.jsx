/* ═══════════════════════════════════════════════════════════════
   AdminCatalogos.jsx
   Gestión de datos maestros / catálogos:
     • Marcas de llantas   (ya existente en BD)
     • Marcas de autos
     • Modelos de autos
     • Anchos de llantas
     • Perfiles (alto) de llantas
     • Aros (rin) de llantas
   Cada sección tiene su propia tabla CRUD en modo frontend-local
   (localStorage) hasta que el backend exponga los endpoints.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import catalogoService from '../../services/catalogo.service';
import '../../components/admin/AdminLayout.css';

/* ── Definición de las pestañas ──────────────────────────────── */
const TABS = [
  { key: 'marcasLlanta',  label: 'Marcas de Llanta',  icon: '🛞', singular: 'marca de llanta'  },
  { key: 'marcasAuto',    label: 'Marcas de Auto',     icon: '🚗', singular: 'marca de auto'    },
  { key: 'modelosAuto',   label: 'Modelos de Auto',    icon: '🚙', singular: 'modelo de auto'   },
  { key: 'anchos',        label: 'Anchos',             icon: '↔️',  singular: 'ancho'            },
  { key: 'perfiles',      label: 'Altos (Perfil)',     icon: '↕️',  singular: 'perfil'           },
  { key: 'aros',          label: 'Aros (Rin)',         icon: '⭕',  singular: 'aro'              },
];

/* ── Campos por pestaña ───────────────────────────────────────── */
const FIELDS = {
  marcasLlanta: [
    { name: 'nombre', label: 'Nombre de marca', placeholder: 'Ej: Michelin', required: true },
    { name: 'pais',   label: 'País de origen',  placeholder: 'Ej: Francia',  required: false },
  ],
  marcasAuto: [
    { name: 'nombre', label: 'Marca de auto', placeholder: 'Ej: Toyota', required: true },
    { name: 'pais',   label: 'País',          placeholder: 'Ej: Japón',  required: false },
  ],
  modelosAuto: [
    { name: 'nombre',    label: 'Modelo',       placeholder: 'Ej: Corolla', required: true  },
    { name: 'marcaAuto', label: 'Marca de auto', placeholder: 'Ej: Toyota', required: false },
    { name: 'anio',      label: 'Año(s)',        placeholder: 'Ej: 2018-2024', required: false },
  ],
  anchos: [
    { name: 'valor', label: 'Ancho (mm)', placeholder: 'Ej: 205', required: true, type: 'number' },
  ],
  perfiles: [
    { name: 'valor', label: 'Perfil (%)', placeholder: 'Ej: 55', required: true, type: 'number' },
  ],
  aros: [
    { name: 'valor', label: 'Aro / Rin (pulgadas)', placeholder: 'Ej: 16', required: true, type: 'number' },
  ],
};

/* ── Componente principal ─────────────────────────────────────── */
export default function AdminCatalogos() {
  const [activeTab, setActiveTab] = useState('marcasLlanta');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  const currentTab = TABS.find(t => t.key === activeTab);
  const fields = FIELDS[activeTab] || [];

  /* ── Cargar datos ─────────────────────────────────────────── */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await catalogoService.getAll(activeTab);
      setItems(data);
    } catch (err) {
      console.error('Error cargando catálogo:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
    setShowForm(false);
    setEditando(null);
  }, [fetchItems]);

  /* ── Toast helper ─────────────────────────────────────────── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Handlers form ────────────────────────────────────────── */
  const handleNuevo = () => {
    const empty = {};
    fields.forEach(f => { empty[f.name] = ''; });
    setForm(empty);
    setEditando(null);
    setShowForm(true);
  };

  const handleEditar = (item) => {
    setForm({ ...item });
    setEditando(item);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editando) {
        await catalogoService.update(activeTab, editando.id, form);
        showToast(`${currentTab.singular} actualizado correctamente`);
      } else {
        await catalogoService.create(activeTab, form);
        showToast(`${currentTab.singular} creado correctamente`);
      }
      setShowForm(false);
      setEditando(null);
      fetchItems();
    } catch (err) {
      showToast('Error al guardar: ' + (err.message || 'Intenta de nuevo'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await catalogoService.remove(activeTab, confirmDelete.id);
      showToast(`${currentTab.singular} eliminado`);
      setConfirmDelete(null);
      fetchItems();
    } catch (err) {
      showToast('Error al eliminar: ' + (err.message || 'Intenta de nuevo'), 'error');
    }
  };

  /* ── Render columns por pestaña ───────────────────────────── */
  const renderRow = (item) => {
    switch (activeTab) {
      case 'marcasLlanta':
      case 'marcasAuto':
        return (
          <>
            <td style={{ fontWeight: 600 }}>{item.nombre}</td>
            <td style={{ color: 'var(--admin-muted)' }}>{item.pais || '—'}</td>
          </>
        );
      case 'modelosAuto':
        return (
          <>
            <td style={{ fontWeight: 600 }}>{item.nombre}</td>
            <td>{item.marcaAuto || '—'}</td>
            <td style={{ color: 'var(--admin-muted)' }}>{item.anio || '—'}</td>
          </>
        );
      case 'anchos':
        return <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.valor} mm</td>;
      case 'perfiles':
        return <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.valor}%</td>;
      case 'aros':
        return <td style={{ fontWeight: 700, fontSize: '1.05rem' }}>R{item.valor}</td>;
      default:
        return <td>{item.nombre || item.valor}</td>;
    }
  };

  const renderHeaders = () => {
    switch (activeTab) {
      case 'marcasLlanta':
      case 'marcasAuto':
        return <><th>Nombre</th><th>País</th></>;
      case 'modelosAuto':
        return <><th>Modelo</th><th>Marca de Auto</th><th>Año</th></>;
      case 'anchos':
        return <th>Ancho</th>;
      case 'perfiles':
        return <th>Perfil (Alto)</th>;
      case 'aros':
        return <th>Aro (Rin)</th>;
      default:
        return <th>Valor</th>;
    }
  };

  /* ── JSX ──────────────────────────────────────────────────── */
  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'error' ? '#ff4444' : '#22c55e',
          color: '#fff', fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <h1>Catálogos</h1>
        <p>Gestiona las listas maestras: marcas, modelos, anchos, altos y aros de llantas</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap',
        marginBottom: 24, borderBottom: '2px solid var(--admin-border)',
        paddingBottom: 0,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '9px 16px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === tab.key ? 'var(--admin-card)' : 'transparent',
              color: activeTab === tab.key ? 'var(--admin-red)' : 'var(--admin-muted)',
              fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid var(--admin-red)' : '2px solid transparent',
              marginBottom: '-2px',
              fontSize: '0.88rem',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar__left">
          <span style={{ color: 'var(--admin-muted)', fontSize: '0.9rem' }}>
            {items.length} {currentTab?.label?.toLowerCase()} registradas
          </span>
        </div>
        <div className="admin-toolbar__right">
          <button className="admin-btn admin-btn--primary" onClick={handleNuevo}>
            + Agregar {currentTab?.singular}
          </button>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" /> Cargando {currentTab?.label?.toLowerCase()}…
        </div>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">{currentTab?.icon}</div>
          <div className="admin-empty__text">No hay {currentTab?.label?.toLowerCase()} registradas</div>
          <div className="admin-empty__sub" style={{ marginTop: 8, color: 'var(--admin-muted)', fontSize: '0.85rem' }}>
            Haz clic en "+ Agregar {currentTab?.singular}" para comenzar
          </div>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                {renderHeaders()}
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ color: 'var(--admin-muted)', fontSize: '0.82rem' }}>
                    {idx + 1}
                  </td>
                  {renderRow(item)}
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--sm"
                        onClick={() => handleEditar(item)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--sm"
                        onClick={() => setConfirmDelete(item)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>
                {editando ? `Editar ${currentTab?.singular}` : `Nueva ${currentTab?.singular}`}
              </h2>
              <button className="admin-modal__close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal__body">
                {fields.map(field => (
                  <div className="admin-form-group" key={field.name}>
                    <label>
                      {field.label}
                      {field.required && <span style={{ color: 'var(--admin-red)' }}> *</span>}
                    </label>
                    <input
                      name={field.name}
                      type={field.type || 'text'}
                      value={form[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      min={field.type === 'number' ? 0 : undefined}
                    />
                  </div>
                ))}
              </div>
              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                  disabled={saving}
                >
                  {saving ? 'Guardando…' : (editando ? 'Guardar Cambios' : `Crear ${currentTab?.singular}`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Delete */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="admin-modal__header">
              <h2>Confirmar Eliminación</h2>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-confirm">
                <div className="admin-confirm__icon">⚠️</div>
                <div className="admin-confirm__text">
                  ¿Eliminar <strong>{confirmDelete.nombre || `${currentTab?.singular} ${confirmDelete.valor}`}</strong>?
                </div>
                <div className="admin-confirm__sub">Esta acción no se puede deshacer.</div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
