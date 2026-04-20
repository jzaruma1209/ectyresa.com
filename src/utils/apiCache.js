/**
 * apiCache.js — Caché en memoria simple para respuestas de la API
 *
 * Evita refetching innecesario de datos que no cambian frecuentemente
 * (catálogo de productos, búsquedas repetidas).
 *
 * Funciona como un Map con TTL (time-to-live) por entrada.
 * No requiere dependencias externas.
 *
 * Uso:
 *   import { apiCache } from '../utils/apiCache';
 *   const cached = apiCache.get('all-products');
 *   if (cached) return cached;
 *   const data = await fetchData();
 *   apiCache.set('all-products', data, 5 * 60 * 1000); // 5 min
 */

const cache = new Map();

const apiCache = {
  /**
   * Obtiene un valor del caché si existe y no ha expirado.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const entry = cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      cache.delete(key); // Limpiar entrada expirada
      return null;
    }
    return entry.data;
  },

  /**
   * Almacena un valor en el caché con TTL.
   * @param {string} key
   * @param {any} data
   * @param {number} ttlMs — Tiempo de vida en milisegundos (default: 5 min)
   */
  set(key, data, ttlMs = 5 * 60 * 1000) {
    cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  },

  /**
   * Invalida una clave específica.
   * @param {string} key
   */
  invalidate(key) {
    cache.delete(key);
  },

  /**
   * Invalida todas las entradas que empiecen con un prefijo.
   * Útil para invalidar grupos de búsquedas.
   * @param {string} prefix
   */
  invalidateByPrefix(prefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
      }
    }
  },

  /**
   * Limpia todo el caché.
   */
  clear() {
    cache.clear();
  },

  /**
   * Número de entradas activas en el caché (para debugging).
   */
  get size() {
    return cache.size;
  },
};

export default apiCache;
