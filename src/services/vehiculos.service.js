// Fase 3 — Servicio de Vehículos
// Conecta con los endpoints reales del backend para marcas y modelos

import api from '../lib/api';

export const vehiculosService = {
  /**
   * Obtiene todas las marcas con sus modelos anidados.
   * GET /vehiculos/marcas/completo
   * Respuesta: { success, data: [ { idMarca, nombre, modelos: [{idModelo, nombre}] } ] }
   */
  getMarcasCompleto: async () => {
    const response = await api.get('/vehiculos/marcas/completo');
    return response.data.data; // array de marcas con modelos anidados
  },

  /**
   * Obtiene los modelos de una marca específica.
   * GET /vehiculos/marcas/:idMarca/modelos
   * Respuesta: { success, data: [ { idModelo, nombre } ] }
   */
  getModelosPorMarca: async (idMarca) => {
    const response = await api.get(`/vehiculos/marcas/${idMarca}/modelos`);
    return response.data.data; // array de modelos
  },
};

export default vehiculosService;
