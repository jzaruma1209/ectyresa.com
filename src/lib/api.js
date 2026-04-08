import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests — inyecta el token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses — maneja 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sesión expirada o token inválido
      localStorage.removeItem(STORAGE_KEYS.TOKEN);

      // Disparar evento custom para que AuthInitializer limpie Redux
      window.dispatchEvent(new CustomEvent('auth:logout'));

      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Log de errores para desarrollo
    if (error.response) {
      console.error('API Error:', error.response.data?.message || error.response.statusText);
    } else if (error.request) {
      console.error('Network Error: No se pudo conectar con el servidor');
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
