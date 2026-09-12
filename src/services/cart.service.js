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

// Agrega el sesionId como query param si el usuario NO está logueado.
// El backend lee sesionId de req.query en TODAS las rutas del carrito
// (incluida /agregar), así que siempre debe viajar por query, nunca por body.
const buildParams = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) return {}; // el JWT se inyecta automáticamente por el interceptor
  return { sesionId: getOrCreateSesionId() };
};

// ── Mapeo de la respuesta del backend al formato que usa el frontend ──────────
// El backend devuelve GET/POST/PUT/DELETE de carrito como:
//   { data: { carrito: { idCarrito, items: [...] }, resumen: {...} } }
// Cada item trae: { idItem, idProducto, cantidad, precioUnitario,
//   producto: { idProducto, nombre, precio, precioAnterior, stock, activo,
//               imagenes: [...], marca: { nombre }, modelo, medidas: { texto } } }
// El frontend espera items con { cartItemId, productId, quantity, product: {...} }

const mapItemFromBackend = (item) => {
  const producto = item.producto || {};
  return {
    // El ID interno del item en el carrito (para actualizar/eliminar)
    cartItemId: item.idItem,
    productId: item.idProducto ?? producto.idProducto,
    quantity: item.cantidad,
    product: {
      id: item.idProducto ?? producto.idProducto,
      name: producto.nombre || 'Producto',
      brand: producto.marca?.nombre || '',
      measure: producto.medidas?.texto || '',
      price: parseFloat(item.precioUnitario ?? producto.precio ?? 0),
      finalPrice: parseFloat(item.precioUnitario ?? producto.precio ?? 0),
      image: producto.imagenes?.[0]?.urlImagen || null,
      stock: producto.stock ?? 0,
      inStock: (producto.stock ?? 0) > 0,
    },
  };
};

const mapCartFromBackend = (data) => {
  // El backend anida los items en data.carrito.items, no en data.items directamente.
  const items = (data?.carrito?.items || data?.items || []).map(mapItemFromBackend);
  const resumen = data?.resumen || {};
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
   * POST /carrito/agregar?sesionId=...  — body: { idProducto, cantidad }
   * El backend espera 'idProducto' (id de la fila en la tabla productos,
   * NO el idLlanta) y el sesionId siempre por query string.
   */
  agregarItem: async (idProducto, cantidad = 1) => {
    const response = await api.post(
      '/carrito/agregar',
      { idProducto, cantidad },
      { params: buildParams() }
    );
    return mapCartFromBackend(response.data.data);
  },

  /**
   * Actualiza la cantidad de un item del carrito.
   * PUT /carrito/actualizar/:id  — body: { cantidad }
   * El :id es el idItem del item en el carrito (no el idProducto).
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
