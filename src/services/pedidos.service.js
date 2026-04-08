// Fase 5 — Servicio de Pedidos (Conectado al backend real)
// Requiere JWT (Autenticación)

import api from '../lib/api';

export const pedidosService = {
  /**
   * Procesar el pago y convertir el carrito en un pedido.
   * POST /pedidos/checkout
   * Body: { idDireccionEntrega, requiereInstalacion }
   */
  checkout: async (checkoutData) => {
    const response = await api.post('/pedidos/checkout', checkoutData);
    return response.data.data; 
  },

  /**
   * Obtener el historial completo de pedidos del usuario.
   * GET /pedidos
   */
  getPedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data.data; // Array de pedidos
  },

  /**
   * Obtener los detalles de un pedido específico.
   * GET /pedidos/:id
   */
  getDetallePedido: async (id) => {
    const response = await api.get(`/pedidos/${id}`);
    return response.data.data;
  },

  /**
   * Obtener el historial de estados de un pedido (tracking).
   * GET /pedidos/:id/tracking
   */
  getTracking: async (id) => {
    const response = await api.get(`/pedidos/${id}/tracking`);
    return response.data.data;
  },
};

export default pedidosService;
