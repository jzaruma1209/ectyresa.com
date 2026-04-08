import api from '../lib/api';

/**
 * Servicio de autenticación.
 * Maneja login, registro, logout y perfil contra el backend.
 */
export const authService = {
  /**
   * Iniciar sesión
   * POST /clientes/login
   */
  login: async (email, password) => {
    const response = await api.post('/clientes/login', { email, password });
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * POST /clientes/registro
   * Campos requeridos: tipoIdentificacion, numeroIdentificacion, nombres,
   *                     apellidos, email, telefono, password
   */
  register: async (userData) => {
    const response = await api.post('/clientes/registro', userData);
    return response.data;
  },

  /**
   * Cerrar sesión
   * POST /clientes/logout
   */
  logout: async () => {
    try {
      await api.post('/clientes/logout');
    } catch {
      // Si falla el logout en el backend, no importa — limpiamos localmente
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   * GET /clientes/perfil
   */
  getProfile: async () => {
    const response = await api.get('/clientes/perfil');
    return response.data;
  },

  /**
   * Actualizar perfil del usuario
   * PUT /clientes/perfil
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/clientes/perfil', profileData);
    return response.data;
  },
};

export default authService;
