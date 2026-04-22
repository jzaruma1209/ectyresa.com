/* ═══════════════════════════════════════════════════════════════
   catalogo.service.js
   Servicio para gestionar los catálogos maestros del admin:
     - Marcas de llantas    → /admin/catalogos/marcas-llanta
     - Marcas de autos      → /admin/catalogos/marcas-auto
     - Modelos de autos     → /admin/catalogos/modelos-auto
     - Anchos               → /admin/catalogos/anchos
     - Perfiles (altos)     → /admin/catalogos/perfiles
     - Aros (rin)           → /admin/catalogos/aros

   NOTA: Mientras el backend no tenga estos endpoints, los datos
   se persisten en localStorage como fallback temporal.
   Cuando el backend esté listo, sólo hay que cambiar el flag
   USE_BACKEND = true y los endpoints correspondientes.
   ═══════════════════════════════════════════════════════════════ */

import api from '../lib/api';

/* ── Mapeo tab → endpoint backend (para cuando esté listo) ─── */
const ENDPOINTS = {
  marcasLlanta : '/vehiculos/marcas',      // ya existe
  marcasAuto   : '/admin/catalogos/marcas-auto',
  modelosAuto  : '/admin/catalogos/modelos-auto',
  anchos       : '/admin/catalogos/anchos',
  perfiles     : '/admin/catalogos/perfiles',
  aros         : '/admin/catalogos/aros',
};

/* ── Endpoints que SÍ existen en el backend (solo GET) ──────── */
// GET  /vehiculos/marcas            → listar marcas de llantas
// GET  /vehiculos/marcas/completo   → marcas + modelos anidados
// GET  /vehiculos/marcas/:id/modelos → modelos de una marca
//
// NO existen endpoints para:
//   - POST/PUT/DELETE de marcas de llantas
//   - Marcas de autos, modelos de autos
//   - Anchos, perfiles, aros
// Todo el CRUD de catálogos usa localStorage hasta que el backend los implemente.

/* ── Tabs con endpoint de LECTURA en el backend ─────────────── */
const BACKEND_READ_ONLY = {
  marcasLlanta: true,   // GET /vehiculos/marcas  ← existe
  marcasAuto  : false,
  modelosAuto : false,
  anchos      : false,
  perfiles    : false,
  aros        : false,
};

/* ── Todos los CRUD van a localStorage (ningún endpoint de escritura existe) */
const BACKEND_WRITE = {
  marcasLlanta: false,
  marcasAuto  : false,
  modelosAuto : false,
  anchos      : false,
  perfiles    : false,
  aros        : false,
};

/* ── Helpers localStorage ─────────────────────────────────────── */
const LS_KEY = (tab) => `ectyre_catalogo_${tab}`;

const lsGetAll = (tab) => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY(tab)) || '[]');
  } catch {
    return [];
  }
};

const lsSave = (tab, items) => {
  localStorage.setItem(LS_KEY(tab), JSON.stringify(items));
};

const nextId = (items) =>
  items.length ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;

/* ── Servicio ─────────────────────────────────────────────────── */
const catalogoService = {

  /* Obtener todos */
  getAll: async (tab) => {
    // Si hay endpoint de lectura en el backend, lo usamos
    if (BACKEND_READ_ONLY[tab]) {
      try {
        const response = await api.get(ENDPOINTS[tab]);
        const data = response.data?.data || response.data;
        const list = data?.marcas || data?.items || data || [];
        // Normalizar: asegurarse de que tengan id
        return list.map((item, idx) => ({
          ...item,
          id: item.id || item.idMarca || item.idModelo || idx + 1,
        }));
      } catch (err) {
        console.warn(`Error fetch backend ${tab}, usando localStorage:`, err.message);
        return lsGetAll(tab);
      }
    }
    // Fallback localStorage para todos los demás
    return lsGetAll(tab);
  },

  /* Crear — siempre localStorage (no hay endpoints de escritura) */
  create: async (tab, data) => {
    if (BACKEND_WRITE[tab]) {
      const response = await api.post(ENDPOINTS[tab], data);
      return response.data;
    }
    const items = lsGetAll(tab);
    const newItem = { ...data, id: nextId(items), createdAt: new Date().toISOString() };
    lsSave(tab, [...items, newItem]);
    return newItem;
  },

  /* Actualizar — siempre localStorage */
  update: async (tab, id, data) => {
    if (BACKEND_WRITE[tab]) {
      const response = await api.put(`${ENDPOINTS[tab]}/${id}`, data);
      return response.data;
    }
    const items = lsGetAll(tab);
    const updated = items.map(i => (i.id === id ? { ...i, ...data } : i));
    lsSave(tab, updated);
    return updated.find(i => i.id === id);
  },

  /* Eliminar — siempre localStorage */
  remove: async (tab, id) => {
    if (BACKEND_WRITE[tab]) {
      const response = await api.delete(`${ENDPOINTS[tab]}/${id}`);
      return response.data;
    }
    const items = lsGetAll(tab).filter(i => i.id !== id);
    lsSave(tab, items);
    return { success: true };
  },

  /* ── Helpers para dropdowns en AdminProductos ─────────────── */

  /** Devuelve lista de anchos como [{value, label}] */
  getAnchoOptions: async () => {
    const items = await catalogoService.getAll('anchos');
    if (items.length === 0) return [];
    return items
      .sort((a, b) => Number(a.valor) - Number(b.valor))
      .map(i => ({ value: i.valor, label: `${i.valor} mm` }));
  },

  /** Devuelve lista de perfiles como [{value, label}] */
  getPerfilOptions: async () => {
    const items = await catalogoService.getAll('perfiles');
    if (items.length === 0) return [];
    return items
      .sort((a, b) => Number(a.valor) - Number(b.valor))
      .map(i => ({ value: i.valor, label: `${i.valor}%` }));
  },

  /** Devuelve lista de aros como [{value, label}] */
  getAroOptions: async () => {
    const items = await catalogoService.getAll('aros');
    if (items.length === 0) return [];
    return items
      .sort((a, b) => Number(a.valor) - Number(b.valor))
      .map(i => ({ value: i.valor, label: `R${i.valor}` }));
  },
};

export default catalogoService;
