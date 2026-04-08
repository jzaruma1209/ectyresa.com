// Fase 5 — Servicio de Direcciones (Conectado al backend real)
// Requiere JWT (Autenticación)

import api from '../lib/api';

export const direccionesService = {
  /**
   * Listar todas las direcciones del usuario logueado.
   * GET /direcciones
   */
  getDirecciones: async () => {
    const response = await api.get('/direcciones');
    return response.data.data; // array de direcciones
  },

  /**
   * Crear una nueva dirección.
   * POST /direcciones
   */
  crearDireccion: async (direccionData) => {
    const response = await api.post('/direcciones', direccionData);
    return response.data.data;
  },

  /**
   * Actualizar una dirección existente.
   * PUT /direcciones/:id
   */
  actualizarDireccion: async (id, direccionData) => {
    const response = await api.put(`/direcciones/${id}`, direccionData);
    return response.data.data;
  },

  /**
   * Eliminar una dirección.
   * DELETE /direcciones/:id
   */
  eliminarDireccion: async (id) => {
    const response = await api.delete(`/direcciones/${id}`);
    return response.data.data;
  },
};

export default direccionesService;
