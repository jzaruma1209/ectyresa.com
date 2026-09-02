import { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/admin.service';
import catalogoService from '../../services/catalogo.service';
import ImageDropzone from '../../components/admin/ImageDropzone';

/**
 * Módulo CRUD de productos (llantas) para el admin.
 * Tabla con paginación, formulario de crear/editar y eliminar con confirmación.
 */
export default function AdminProductos() {
  const [llantas, setLlantas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [anchoOpts, setAnchoOpts] = useState([]);
  const [perfilOpts, setPerfilOpts] = useState([]);
  const [aroOpts, setAroOpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState(null);
  const [pendingLogoMarca, setPendingLogoMarca] = useState(null);
  const [pendingBanner, setPendingBanner] = useState(null);
  const [pendingFoto2, setPendingFoto2] = useState(null);
  const [pendingFoto3, setPendingFoto3] = useState(null);
  const [pendingFoto4, setPendingFoto4] = useState(null);

  const emptyForm = {
    tipoProducto: 'llantas',
    idMarca: '', modelo: '', ancho: '', perfil: '', rin: '',
    precio: '', stock: '', descripcion: '', especificaciones: '',
    traccion: '', treadwear: '', temperatura: '', indiceVelocidad: '', indiceCarga: '',
    imagen_url: '',
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
  useEffect(() => {
    fetchMarcas();
    // Cargar opciones de anchos, perfiles y aros desde catálogos
    catalogoService.getAnchoOptions().then(setAnchoOpts);
    catalogoService.getPerfilOptions().then(setPerfilOpts);
    catalogoService.getAroOptions().then(setAroOpts);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditar = (llanta) => {
    setEditando(llanta);
    setPendingImageFile(null);
    setForm({
      idMarca: llanta.idMarca || '',
      modelo: llanta.modelo || '',
      ancho: llanta.ancho || '',
      perfil: llanta.perfil || '',
      rin: llanta.rin || '',
      precio: llanta.precio || '',
      stock: llanta.stock || '',
      descripcion: llanta.descripcion || '',
      especificaciones: llanta.especificaciones || '',
      traccion: llanta.traccion || '',
      treadwear: llanta.treadwear || '',
      temperatura: llanta.temperatura || '',
      indiceVelocidad: llanta.indiceVelocidad || '',
      indiceCarga: llanta.indiceCarga || '',
      tipoProducto: llanta.tipoProducto || 'llantas',
      imagen_url: llanta.imagen_url || llanta.imagenUrl || '',
    });
    setShowForm(true);
  };

  const handleNuevo = () => {
    setEditando(null);
    setPendingImageFile(null);
    setPendingLogoMarca(null);
    setPendingBanner(null);
    setPendingFoto2(null);
    setPendingFoto3(null);
    setPendingFoto4(null);
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

      let idLlantaFinal;

      if (editando) {
        // Editar: actualizar datos del producto
        await adminService.updateLlanta(editando.id || editando.idLlanta, payload);
        idLlantaFinal = editando.id || editando.idLlanta;
      } else {
        // Crear: obtener el id de la nueva llanta
        const created = await adminService.createLlanta(payload);
        idLlantaFinal = created?.data?.idLlanta || created?.idLlanta || created?.data?.id || created?.id;
      }

      // Si hay una imagen pendiente, subirla al backend (Cloudinary)
      if (pendingImageFile && idLlantaFinal) {
        try {
          await adminService.subirImagenLlanta(idLlantaFinal, pendingImageFile, 'PRINCIPAL');
        } catch (imgErr) {
          // El producto ya se guardó — solo avisamos del fallo de imagen
          alert('Producto guardado, pero hubo un error al subir la imagen: ' + (imgErr.response?.data?.message || imgErr.message));
        }
      }

      setShowForm(false);
      setEditando(null);
      setForm(emptyForm);
      setPendingImageFile(null);
      setPendingLogoMarca(null);
      setPendingBanner(null);
      setPendingFoto2(null);
      setPendingFoto3(null);
      setPendingFoto4(null);
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
              <div className="admin-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-form-group">
                  <label>Tipo de Producto</label>
                  <select name="tipoProducto" value={form.tipoProducto} onChange={handleChange} required>
                    <option value="llantas">Llantas</option>
                    <option value="aros">Aros</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="tubos">Tubos</option>
                  </select>
                </div>

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
                {form.tipoProducto === 'llantas' && (
                  <>
                    <div className="admin-form-row" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Foto Logo Marca</label>
                        <ImageDropzone onFileChange={setPendingLogoMarca} previewUrl={null} disabled={saving} />
                      </div>
                      <div className="admin-form-group">
                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Banner de Descuento (opcional)</label>
                        <ImageDropzone onFileChange={setPendingBanner} previewUrl={null} disabled={saving} />
                      </div>
                    </div>
                  </>
                )}
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Ancho</label>
                    {anchoOpts.length > 0 ? (
                      <select name="ancho" value={form.ancho} onChange={handleChange} required>
                        <option value="">Seleccionar ancho…</option>
                        {anchoOpts.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input name="ancho" type="number" value={form.ancho} onChange={handleChange} required placeholder="205" />
                    )}
                  </div>
                  <div className="admin-form-group">
                    <label>Perfil (Alto)</label>
                    {perfilOpts.length > 0 ? (
                      <select name="perfil" value={form.perfil} onChange={handleChange} required>
                        <option value="">Seleccionar perfil…</option>
                        {perfilOpts.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input name="perfil" type="number" value={form.perfil} onChange={handleChange} required placeholder="55" />
                    )}
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Rin (Aro)</label>
                    {aroOpts.length > 0 ? (
                      <select name="rin" value={form.rin} onChange={handleChange} required>
                        <option value="">Seleccionar rin…</option>
                        {aroOpts.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input name="rin" type="number" value={form.rin} onChange={handleChange} required placeholder="16" />
                    )}
                  </div>
                  <div className="admin-form-group">
                    <label>Precio ($)</label>
                    <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required placeholder="350000" />
                  </div>
                </div>

                {form.tipoProducto === 'llantas' && (
                  <div className="admin-form-group" style={{ background: '#f9f9f9', padding: '1rem', borderRadius: 8, marginTop: '1rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>Atributos de Llanta</h4>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Treadwear</label>
                        <select name="treadwear" value={form.treadwear} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          <option value="200">200 (Blando/Deportivo)</option>
                          <option value="300">300 (Medio)</option>
                          <option value="400">400 (Duro/Duradero)</option>
                          <option value="500">500+</option>
                          <option value="manual">Manual...</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Tracción</label>
                        <select name="traccion" value={form.traccion} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          <option value="AA">AA (Excelente)</option>
                          <option value="A">A (Buena)</option>
                          <option value="B">B (Regular)</option>
                          <option value="C">C (Aceptable)</option>
                          <option value="manual">Manual...</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Temperatura</label>
                        <select name="temperatura" value={form.temperatura} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          <option value="A">A (Excelente)</option>
                          <option value="B">B (Buena)</option>
                          <option value="C">C (Regular)</option>
                          <option value="manual">Manual...</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Índice Velocidad</label>
                        <select name="indiceVelocidad" value={form.indiceVelocidad} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          <option value="H">H (210 km/h)</option>
                          <option value="V">V (240 km/h)</option>
                          <option value="W">W (270 km/h)</option>
                          <option value="Y">Y (300 km/h)</option>
                          <option value="manual">Manual...</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Índice Carga</label>
                        <select name="indiceCarga" value={form.indiceCarga} onChange={handleChange}>
                          <option value="">Seleccionar...</option>
                          <option value="82">82 (475 kg)</option>
                          <option value="85">85 (515 kg)</option>
                          <option value="88">88 (560 kg)</option>
                          <option value="91">91 (615 kg)</option>
                          <option value="94">94 (670 kg)</option>
                          <option value="manual">Manual...</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="50" />
                </div>
                
                <div className="admin-form-group">
                  <label>Imágenes del producto (Hasta 4 fotos)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <ImageDropzone
                      onFileChange={(file) => setPendingImageFile(file)}
                      previewUrl={form.imagen_url || null}
                      disabled={saving}
                    />
                    <ImageDropzone
                      onFileChange={setPendingFoto2}
                      disabled={saving}
                    />
                    <ImageDropzone
                      onFileChange={setPendingFoto3}
                      disabled={saving}
                    />
                    <ImageDropzone
                      onFileChange={setPendingFoto4}
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Descripción General</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción del producto…" />
                </div>
                <div className="admin-form-group">
                  <label>Especificaciones Técnicas</label>
                  <textarea name="especificaciones" value={form.especificaciones} onChange={handleChange} rows={3} placeholder="Detalles técnicos, garantía, materiales..." />
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
