import api from '../lib/api';
import apiCache from '../utils/apiCache';

// ── TTLs de caché ─────────────────────────────────────
const CACHE_TTL = {
  ALL_PRODUCTS:   5 * 60 * 1000,  // 5 minutos — el catálogo no cambia frecuentemente
  PRODUCT_DETAIL: 10 * 60 * 1000, // 10 minutos — detalle de un producto individual
  SEARCH_RESULTS: 2 * 60 * 1000,  // 2 minutos — resultados de búsqueda
};

/**
 * Mapea un objeto "llanta" del backend al formato "product" que espera la UI.
 * Esto permite que los componentes existentes (ProductCard, ProductInfo, etc.)
 * sigan funcionando sin cambios.
 */
const mapLlantaToProduct = (llanta) => {
  const price = Number(llanta.precio) || 0;
  const finalPrice = llanta.precioOferta ? Number(llanta.precioOferta) : price;
  const discount = price > 0 && finalPrice < price
    ? Math.round(((price - finalPrice) / price) * 100)
    : 0;

  return {
    id: llanta.id,
    name: llanta.modelo || llanta.nombre || 'Sin nombre',
    brand: llanta.marca?.nombre || llanta.marcaNombre || '',
    price,
    finalPrice,
    discount,
    image: llanta.imagenes?.[0]?.urlImagen || llanta.imagenUrl || '/placeholder-tire.png',
    images: llanta.imagenes?.map(img => img.urlImagen) || [],
    stock: llanta.stock ?? 0,
    inStock: (llanta.stock ?? 0) > 0,
    description: llanta.descripcion || '',
    measure: llanta.medida || `${llanta.ancho || ''}/${llanta.perfil || ''}R${llanta.rin || ''}`,
    width: llanta.ancho,
    height: llanta.perfil,
    rim: llanta.rin,
    category: llanta.categoria || '',
    featured: llanta.destacado || false,
    active: llanta.activo !== false,
    // Campos adicionales del backend que pueden ser útiles
    _raw: llanta,
  };
};

/**
 * Mapea un array de llantas
 */
const mapLlantasToProducts = (llantas) => {
  if (!Array.isArray(llantas)) return [];
  return llantas.map(mapLlantaToProduct);
};

export const productsService = {
  /**
   * Obtener todas las llantas (catálogo)
   * Backend: GET /llantas
   * Caché: 5 minutos
   */
  getAllProducts: async (params = {}) => {
    const cacheKey = `all-products:${JSON.stringify(params)}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get('/llantas', { params });
    const llantas = response.data.data || response.data;
    const products = mapLlantasToProducts(Array.isArray(llantas) ? llantas : llantas.llantas || []);

    apiCache.set(cacheKey, products, CACHE_TTL.ALL_PRODUCTS);
    return products;
  },

  /**
   * Obtener una llanta por ID
   * Backend: GET /llantas/:id
   * Caché: 10 minutos
   */
  getProductById: async (id) => {
    const cacheKey = `product:${id}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get(`/llantas/${id}`);
    const llanta = response.data.data || response.data;
    const product = mapLlantaToProduct(llanta);

    apiCache.set(cacheKey, product, CACHE_TTL.PRODUCT_DETAIL);
    return product;
  },

  /**
   * Buscar llantas por medida
   * Backend: GET /llantas/buscar-medida?ancho=X&perfil=Y&rin=Z
   * Caché: 2 minutos
   */
  searchByMeasure: async ({ ancho, perfil, rin }) => {
    const params = {};
    if (ancho) params.ancho = ancho;
    if (perfil) params.perfil = perfil;
    if (rin) params.rin = rin;

    const cacheKey = `search-measure:${ancho}-${perfil}-${rin}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get('/llantas/buscar-medida', { params });
    const llantas = response.data.data || response.data;
    const products = mapLlantasToProducts(Array.isArray(llantas) ? llantas : []);

    apiCache.set(cacheKey, products, CACHE_TTL.SEARCH_RESULTS);
    return products;
  },

  /**
   * Buscar llantas por vehículo
   * Backend: GET /llantas/buscar-vehiculo?marca=X&modelo=Y&anio=Z
   * Caché: 2 minutos
   */
  searchByVehicle: async ({ marca, modelo, anio }) => {
    const params = {};
    if (marca) params.marca = marca;
    if (modelo) params.modelo = modelo;
    if (anio) params.anio = anio;

    const cacheKey = `search-vehicle:${marca}-${modelo}-${anio}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get('/llantas/buscar-vehiculo', { params });
    const llantas = response.data.data || response.data;
    const products = mapLlantasToProducts(Array.isArray(llantas) ? llantas : []);

    apiCache.set(cacheKey, products, CACHE_TTL.SEARCH_RESULTS);
    return products;
  },

  /**
   * Buscar productos con filtros genéricos
   * Traduce los filtros del frontend a los params del backend
   */
  searchProducts: async (filters = {}) => {
    const params = {};

    // Traducir filtros de medida
    if (filters.width) params.ancho = filters.width;
    if (filters.height) params.perfil = filters.height;
    if (filters.rim) params.rin = filters.rim;

    // Traducir filtros de vehículo
    if (filters.brand) params.marca = filters.brand;
    if (filters.model) params.modelo = filters.model;
    if (filters.year) params.anio = filters.year;

    // Filtros directos
    if (filters.category) params.categoria = filters.category;
    if (filters.minPrice) params.precioMin = filters.minPrice;
    if (filters.maxPrice) params.precioMax = filters.maxPrice;
    if (filters.sortBy) params.ordenar = filters.sortBy;

    // Determinar qué endpoint usar según los filtros
    if (params.ancho || params.perfil || params.rin) {
      return productsService.searchByMeasure({
        ancho: params.ancho,
        perfil: params.perfil,
        rin: params.rin,
      });
    }

    if (params.marca || params.modelo || params.anio) {
      return productsService.searchByVehicle({
        marca: params.marca,
        modelo: params.modelo,
        anio: params.anio,
      });
    }

    // Búsqueda general
    const cacheKey = `search-general:${JSON.stringify(params)}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;

    const response = await api.get('/llantas', { params });
    const llantas = response.data.data || response.data;
    const products = mapLlantasToProducts(Array.isArray(llantas) ? llantas : llantas.llantas || []);

    apiCache.set(cacheKey, products, CACHE_TTL.SEARCH_RESULTS);
    return products;
  },
};

export { mapLlantaToProduct, mapLlantasToProducts };
export default productsService;
