import { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin.service';

/**
 * Módulo CRUD de productos (llantas) para el admin.
 * Tabla con paginación, formulario de crear/editar y eliminar con confirmación.
 */
export default function AdminProductos() {
  const [llantas, setLlantas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    idMarca: '', modelo: '', ancho: '', perfil: '', rin: '',
    precio: '', stock: '', descripcion: '', imagen_url: '',
  };
  const [form, setForm] = useState(emptyForm);

  const fetchLlantas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getLlantas({ page, limit: 20 });
      const responseData = data.data || data;
      setLlantas(responseData.llantas || responseData || []);
      setTotalPages(responseData.totalPaginas || responseData.totalPages || 1);
    } catch (err) {
      console.error('Error cargando llantas:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchMarcas = async () => {
    try {
      const data = await adminService.getMarcas();
      const responseData = data.data || data;
      setMarcas(responseData.marcas || responseData || []);
    } catch (err) {
      console.error('Error cargando marcas:', err);
    }
  };

  useEffect(() => { fetchLlantas(); }, [fetchLlantas]);
  useEffect(() => { fetchMarcas(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditar = (llanta) => {
    setEditando(llanta);
    setForm({
      idMarca: llanta.idMarca || '',
      modelo: llanta.modelo || '',
      ancho: llanta.ancho || '',
      perfil: llanta.perfil || '',
      rin: llanta.rin || '',
      precio: llanta.precio || '',
      stock: llanta.stock || '',
      descripcion: llanta.descripcion || '',
      imagen_url: llanta.imagen_url || llanta.imagenUrl || '',
    });
    setShowForm(true);
  };

  const handleNuevo = () => {
    setEditando(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        ancho: Number(form.ancho),
        perfil: Number(form.perfil),
        rin: Number(form.rin),
        precio: Number(form.precio),
        stock: Number(form.stock),
        idMarca: Number(form.idMarca),
      };

      if (editando) {
        await adminService.updateLlanta(editando.id || editando.idLlanta, payload);
      } else {
        await adminService.createLlanta(payload);
      }

      setShowForm(false);
      setEditando(null);
      setForm(emptyForm);
      fetchLlantas();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await adminService.deleteLlanta(confirmDelete.id || confirmDelete.idLlanta);
      setConfirmDelete(null);
      fetchLlantas();
    } catch (err) {
      alert('Error al eliminar: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatMoney = (val) => `$${Number(val || 0).toLocaleString('es-CO')}`;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Productos</h1>
        <p>Catálogo completo de llantas</p>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar__left" />
        <div className="admin-toolbar__right">
          <button className="admin-btn admin-btn--primary" onClick={handleNuevo}>
            + Agregar Producto
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /> Cargando productos…</div>
      ) : llantas.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">🛞</div>
          <div className="admin-empty__text">No hay productos en el catálogo</div>
        </div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Medida</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {llantas.map((ll) => (
                  <tr key={ll.id || ll.idLlanta}>
                    <td>
                      {(ll.imagen_url || ll.imagenUrl) ? (
                        <img
                          src={ll.imagen_url || ll.imagenUrl}
                          alt={ll.modelo}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }}
                        />
                      ) : (
                        <div style={{
                          width: 44, height: 44, background: 'var(--admin-bg)',
                          borderRadius: 6, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '1.2rem',
                        }}>🛞</div>
                      )}
                    </td>
                    <td>{ll.marca?.nombre || ll.nombreMarca || '-'}</td>
                    <td style={{ fontWeight: 600 }}>{ll.modelo}</td>
                    <td>{ll.ancho}/{ll.perfil} R{ll.rin}</td>
                    <td style={{ fontWeight: 600 }}>{formatMoney(ll.precio)}</td>
                    <td>
                      <span className={
                        ll.stock > 10 ? 'stock-ok' :
                        ll.stock > 0 ? 'stock-low' : 'stock-out'
                      }>
                        {ll.stock}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      <button className="admin-btn admin-btn--secondary admin-btn--sm" onClick={() => handleEditar(ll)}>
                        ✏️ Editar
                      </button>
                      <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setConfirmDelete(ll)}>
                        🗑️
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
                <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente →</button>
            </div>
          )}
        </>
      )}

      {/* Modal Formulario */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="admin-modal__close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal__body">
                <div className="admin-form-group">
                  <label>Marca</label>
                  <select name="idMarca" value={form.idMarca} onChange={handleChange} required>
                    <option value="">Seleccionar marca…</option>
                    {marcas.map((m) => (
                      <option key={m.id || m.idMarca} value={m.id || m.idMarca}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Modelo</label>
                  <input name="modelo" value={form.modelo} onChange={handleChange} required placeholder="Ej: Pilot Sport 5" />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Ancho</label>
                    <input name="ancho" type="number" value={form.ancho} onChange={handleChange} required placeholder="205" />
                  </div>
                  <div className="admin-form-group">
                    <label>Perfil</label>
                    <input name="perfil" type="number" value={form.perfil} onChange={handleChange} required placeholder="55" />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Rin</label>
                    <input name="rin" type="number" value={form.rin} onChange={handleChange} required placeholder="16" />
                  </div>
                  <div className="admin-form-group">
                    <label>Precio ($)</label>
                    <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required placeholder="350000" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="50" />
                </div>
                <div className="admin-form-group">
                  <label>URL de imagen</label>
                  <input name="imagen_url" value={form.imagen_url} onChange={handleChange} placeholder="https://…" />
                </div>
                <div className="admin-form-group">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción del producto…" />
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving ? 'Guardando…' : (editando ? 'Guardar Cambios' : 'Crear Producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="admin-modal__header">
              <h2>Confirmar Eliminación</h2>
              <button className="admin-modal__close" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-confirm">
                <div className="admin-confirm__icon">⚠️</div>
                <div className="admin-confirm__text">
                  ¿Estás seguro de eliminar <strong>{confirmDelete.modelo}</strong>?
                </div>
                <div className="admin-confirm__sub">Esta acción no se puede deshacer.</div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="admin-btn admin-btn--danger" onClick={handleDelete}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
