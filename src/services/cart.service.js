// Fase 4 — Servicio del carrito conectado al backend
// Reemplaza el anterior que solo usaba localStorage.
//
// Estrategia dual (Regla 4.1):
//   - Usuario NO logueado → envía sesionId como query param
//   - Usuario logueado    → el interceptor de api.js ya inyecta el JWT en el header
//
// El sesionId del invitado persiste en localStorage bajo 'ectyre_session_id' (Regla 4.2)

import api from '../lib/api';
import { STORAGE_KEYS } from '../constants';

// ── Helper: obtener o generar sesionId del invitado ──────────────────────────
const getOrCreateSesionId = () => {
  let sesionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sesionId) {
    // UUID simple suficiente para identificar la sesión del invitado
    sesionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sesionId);
  }
  return sesionId;
};

// Agrega el sesionId como query param si el usuario NO está logueado
const buildParams = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) return {}; // el JWT se inyecta automáticamente por el interceptor
  return { sesionId: getOrCreateSesionId() };
};

// ── Mapeo de la respuesta del backend al formato que usa el frontend ──────────
// El backend devuelve items con { idItem, idLlanta, cantidad, llanta: {...}, precioUnitario }
// El frontend espera items con { productId, quantity, product: { id, name, price, ... } }

const mapItemFromBackend = (item) => ({
  // El ID interno del item en el carrito (para actualizar/eliminar)
  cartItemId: item.idItem,
  // productId = idLlanta (Regla RG-6)
  productId: item.idLlanta ?? item.llanta?.idLlanta,
  quantity: item.cantidad,
  product: {
    id: item.idLlanta ?? item.llanta?.idLlanta,
    name: item.llanta?.modelo || 'Llanta',
    brand: item.llanta?.marca?.nombre || '',
    measure: item.llanta
      ? `${item.llanta.ancho}/${item.llanta.perfil}R${item.llanta.rin}`
      : '',
    price: parseFloat(item.precioUnitario || item.llanta?.precio || 0),
    finalPrice: parseFloat(item.precioUnitario || item.llanta?.precioOferta || item.llanta?.precio || 0),
    image: item.llanta?.imagenes?.[0]?.urlImagen || null,
    stock: item.llanta?.stock || 0,
    inStock: (item.llanta?.stock || 0) > 0,
  },
});

const mapCartFromBackend = (data) => {
  const items = (data.items || []).map(mapItemFromBackend);
  const resumen = data.resumen || {};
  return {
    items,
    // Totales vienen del backend (Regla 4.6)
    subtotal: parseFloat(resumen.subtotal || 0),
    iva: parseFloat(resumen.iva || 0),
    total: parseFloat(resumen.total || 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
};

// ── Servicio ──────────────────────────────────────────────────────────────────

export const carritoService = {
  /**
   * Obtiene el carrito actual del usuario o invitado.
   * GET /carrito
   */
  getCarrito: async () => {
    const response = await api.get('/carrito', { params: buildParams() });
    return mapCartFromBackend(response.data.data);
  },

  /**
   * Agrega un item al carrito.
   * POST /carrito/agregar  — body: { idLlanta, cantidad }
   * El campo que el backend espera es 'idLlanta', no 'productId' (Regla 4.3).
   */
  agregarItem: async (idLlanta, cantidad = 1) => {
    const response = await api.post(
      '/carrito/agregar',
      { idLlanta, cantidad },
      { params: buildParams() }
    );
    return mapCartFromBackend(response.data.data);
  },

  /**
   * Actualiza la cantidad de un item del carrito.
   * PUT /carrito/actualizar/:id  — body: { cantidad }
   * El :id es el idItem del item en el carrito (no el idLlanta).
   */
  actualizarItem: async (idItem, cantidad) => {
    const response = await api.put(
      `/carrito/actualizar/${idItem}`,
      { cantidad },
      { params: buildParams() }
    );
    return mapCartFromBackend(response.data.data);
  },

  /**
   * Elimina un item del carrito.
   * DELETE /carrito/eliminar/:id
   */
  eliminarItem: async (idItem) => {
    const response = await api.delete(
      `/carrito/eliminar/${idItem}`,
      { params: buildParams() }
    );
    return mapCartFromBackend(response.data.data);
  },

  /**
   * Vacía el carrito completo.
   * DELETE /carrito/vaciar
   */
  vaciarCarrito: async () => {
    await api.delete('/carrito/vaciar', { params: buildParams() });
    return { items: [], subtotal: 0, iva: 0, total: 0, itemCount: 0 };
  },

  /**
   * Limpia el sesionId del invitado del localStorage.
   * Se llama cuando el usuario se loguea exitosamente.
   */
  limpiarSesionInvitado: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  },
};

export default carritoService;
