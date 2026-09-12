import api from '../lib/api';

/**
 * Niveles de Inventario — todo lo que se selecciona al crear un producto.
 * Backend: /api/v1/catalogos/*
 *   Tipos de producto (con bandera requiereModeloMedidas), Marcas (logo/banner),
 *   Modelos (por marca), Tipos de uso, Medidas (anchos/altos/aros) y Especificaciones técnicas.
 */

const datos = (response) => response.data?.data ?? response.data;

// Multipart para marcas / especificaciones cuando se adjunta una imagen
const aFormData = (campos, archivos = {}) => {
  const formData = new FormData();
  Object.entries(campos).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null) return;
    formData.append(clave, Array.isArray(valor) ? JSON.stringify(valor) : String(valor));
  });
  Object.entries(archivos).forEach(([clave, archivo]) => {
    if (archivo) formData.append(clave, archivo);
  });
  return formData;
};

const enviar = (metodo, url, campos, archivos = {}) => {
  const hayArchivos = Object.values(archivos).some(Boolean);
  if (!hayArchivos) return api[metodo](url, campos).then(datos);
  return api[metodo](url, aFormData(campos, archivos), {
    headers: { 'Content-Type': undefined },
    timeout: 60000,
  }).then(datos);
};

// Mensaje legible de un error de la API (incluye la lista de errores de validación)
export const mensajeError = (err, porDefecto = 'Ocurrió un error') => {
  const errores = err?.response?.data?.errors;
  if (Array.isArray(errores) && errores.length > 1) {
    return errores.map((e) => (typeof e === 'string' ? e : e.msg)).join(' • ');
  }
  return err?.response?.data?.message || err?.message || porDefecto;
};

export const TIPOS_MEDIDA = [
  { clave: 'anchos', etiqueta: 'Anchos', singular: 'ancho', pk: 'idAncho', ejemplo: '205' },
  { clave: 'altos', etiqueta: 'Altos', singular: 'alto', pk: 'idAlto', ejemplo: '65' },
  { clave: 'aros', etiqueta: 'Aros', singular: 'aro', pk: 'idAro', ejemplo: '15' },
];

// Claves donde la versión anterior guardaba medidas en el navegador
const CLAVES_LOCALES = { anchos: 'ectyre_catalogo_anchos', altos: 'ectyre_catalogo_perfiles', aros: 'ectyre_catalogo_aros' };

const nivelesService = {
  // ─── Consolidado ────────────────────────────────────────────
  getNiveles: (todos = false) => api.get('/catalogos/niveles', { params: todos ? { todos: true } : {} }).then(datos),

  // ─── Tipos de producto ──────────────────────────────────────
  crearTipoProducto: (data) => api.post('/catalogos/tipos-producto', data).then(datos),
  actualizarTipoProducto: (id, data) => api.put(`/catalogos/tipos-producto/${id}`, data).then(datos),
  eliminarTipoProducto: (id) => api.delete(`/catalogos/tipos-producto/${id}`).then(datos),

  // ─── Marcas (logo y banner opcionales como archivo) ─────────
  crearMarca: (data, { logo, banner } = {}) => enviar('post', '/catalogos/marcas', data, { logo, banner }),
  actualizarMarca: (id, data, { logo, banner } = {}) =>
    enviar('put', `/catalogos/marcas/${id}`, data, { logo, banner }),
  eliminarMarca: (id) => api.delete(`/catalogos/marcas/${id}`).then(datos),

  // ─── Modelos ────────────────────────────────────────────────
  crearModelo: (data) => api.post('/catalogos/modelos', data).then(datos),
  actualizarModelo: (id, data) => api.put(`/catalogos/modelos/${id}`, data).then(datos),
  eliminarModelo: (id) => api.delete(`/catalogos/modelos/${id}`).then(datos),

  // ─── Tipos de uso ───────────────────────────────────────────
  crearTipoUso: (data) => api.post('/catalogos/tipos-uso', data).then(datos),
  actualizarTipoUso: (id, data) => api.put(`/catalogos/tipos-uso/${id}`, data).then(datos),
  eliminarTipoUso: (id) => api.delete(`/catalogos/tipos-uso/${id}`).then(datos),

  // ─── Medidas: tipo = anchos | altos | aros ─────────────────
  crearMedida: (tipo, valor) => api.post(`/catalogos/medidas/${tipo}`, { valor }).then(datos),
  actualizarMedida: (tipo, id, data) => api.put(`/catalogos/medidas/${tipo}/${id}`, data).then(datos),
  eliminarMedida: (tipo, id) => api.delete(`/catalogos/medidas/${tipo}/${id}`).then(datos),

  // Medidas que la versión anterior del panel guardó solo en este navegador
  medidasLocalesPendientes: (medidasActuales) => {
    const pendientes = {};
    Object.entries(CLAVES_LOCALES).forEach(([tipo, clave]) => {
      try {
        const guardadas = JSON.parse(localStorage.getItem(clave) || '[]');
        const existentes = new Set((medidasActuales[tipo] || []).map((m) => Number(m.valor)));
        const valores = [...new Set(guardadas.map((i) => Number(i.valor)))].filter(
          (v) => Number.isFinite(v) && v > 0 && !existentes.has(v)
        );
        if (valores.length) pendientes[tipo] = valores;
      } catch {
        /* dato local corrupto: se ignora */
      }
    });
    return pendientes;
  },
  importarMedidasLocales: async (pendientes) => {
    let creadas = 0;
    for (const [tipo, valores] of Object.entries(pendientes)) {
      const res = await api.post(`/catalogos/medidas/${tipo}/lote`, { valores }).then(datos);
      creadas += res?.creados?.length || 0;
      localStorage.removeItem(CLAVES_LOCALES[tipo]);
    }
    return creadas;
  },

  // ─── Especificaciones técnicas (ícono opcional como archivo) ─
  crearEspecificacion: (data, icono) => enviar('post', '/catalogos/especificaciones', data, { icono }),
  actualizarEspecificacion: (id, data, icono) => enviar('put', `/catalogos/especificaciones/${id}`, data, { icono }),
  eliminarEspecificacion: (id) => api.delete(`/catalogos/especificaciones/${id}`).then(datos),
};

export default nivelesService;
