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
  // PRODUCTOS (LLANTAS)
  // ──────────────────────────────────────────
  getLlantas: async (params = {}) => {
    const response = await api.get('/llantas', { params });
    return response.data;
  },

  createLlanta: async (data) => {
    const response = await api.post('/llantas', data);
    return response.data;
  },

  updateLlanta: async (id, data) => {
    const response = await api.put(`/llantas/${id}`, data);
    return response.data;
  },

  deleteLlanta: async (id) => {
    const response = await api.delete(`/llantas/${id}`);
    return response.data;
  },

  updateStock: async (id, stock) => {
    // Endpoint dedicado cuando se cree en el backend
    // Por ahora usa el PUT general
    const response = await api.patch(`/admin/llantas/${id}/stock`, { stock });
    return response.data;
  },

  getMarcas: async () => {
    const response = await api.get('/vehiculos/marcas');
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
