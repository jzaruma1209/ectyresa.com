import api from '../lib/api';

/**
 * Servicio de administración.
 * Todas las peticiones al prefijo /api/v1/admin
 * El token JWT se inyecta automáticamente por el interceptor de api.js
 */
const adminService = {

  // ──────────────────────────────────────────
  // DASHBOARD
  // ──────────────────────────────────────────
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // ──────────────────────────────────────────
  // PEDIDOS
  // ──────────────────────────────────────────
  getPedidos: async (params = {}) => {
    const response = await api.get('/admin/pedidos', { params });
    return response.data;
  },

  getPedidoById: async (id) => {
    const response = await api.get(`/admin/pedidos/${id}`);
    return response.data;
  },

  updateEstadoPedido: async (id, estado) => {
    const response = await api.patch(`/admin/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  // ──────────────────────────────────────────
  // CLIENTES
  // ──────────────────────────────────────────
  getClientes: async (params = {}) => {
    const response = await api.get('/admin/clientes', { params });
    return response.data;
  },

  getClienteById: async (id) => {
    const response = await api.get(`/admin/clientes/${id}`);
    return response.data;
  },

  toggleClienteStatus: async (id) => {
    const response = await api.patch(`/admin/clientes/${id}/toggle`);
    return response.data;
  },

  getClientePedidos: async (id) => {
    const response = await api.get(`/admin/clientes/${id}/pedidos`);
    return response.data;
  },

  // ──────────────────────────────────────────
  // PRODUCTOS (todos los tipos: llantas, baterías, accesorios…)
  // ──────────────────────────────────────────
  getProductos: async (params = {}) => {
    const response = await api.get('/admin/productos', { params });
    return response.data;
  },

  getProducto: async (id) => {
    const response = await api.get(`/admin/productos/${id}`);
    return response.data;
  },

  /**
   * Crea o edita un producto con sus fotos en una sola petición (multipart).
   * @param {object} datos  campos del producto (se envían como JSON en el campo "datos")
   * @param {File[]} imagenes  fotos nuevas (máx 5 en total, lo valida también el backend)
   */
  guardarProducto: async (id, datos, imagenes = []) => {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(datos));
    imagenes.forEach((archivo) => formData.append('imagenes', archivo));
    const config = { headers: { 'Content-Type': undefined }, timeout: 90000 };
    const response = id
      ? await api.put(`/admin/productos/${id}`, formData, config)
      : await api.post('/admin/productos', formData, config);
    return response.data;
  },

  cambiarEstadoProducto: async (id, activo) => {
    const response = await api.patch(`/admin/productos/${id}/estado`, { activo });
    return response.data;
  },

  // Borrado lógico: el producto deja de mostrarse en la tienda
  desactivarProducto: async (id) => {
    const response = await api.delete(`/admin/productos/${id}`);
    return response.data;
  },

  updateStock: async (id, stock) => {
    const response = await api.patch(`/admin/productos/${id}/stock`, { stock });
    return response.data;
  },

  // ──────────────────────────────────────────
  // REPORTES
  // ──────────────────────────────────────────
  getReporteVentas: async (periodo = 'mes') => {
    const response = await api.get('/admin/reportes/ventas', { params: { periodo } });
    return response.data;
  },

  getProductosTop: async () => {
    const response = await api.get('/admin/reportes/productos-top');
    return response.data;
  },

  getStatsCarritos: async () => {
    const response = await api.get('/admin/stats/carritos');
    return response.data;
  },
};

export default adminService;
