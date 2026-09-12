import api from '../lib/api';
import apiCache from '../utils/apiCache';

// ── TTLs de caché ─────────────────────────────────────
const CACHE_TTL = {
  ALL_PRODUCTS:   5 * 60 * 1000,  // 5 minutos — el catálogo no cambia frecuentemente
  PRODUCT_DETAIL: 10 * 60 * 1000, // 10 minutos — detalle de un producto individual
  SEARCH_RESULTS: 2 * 60 * 1000,  // 2 minutos — resultados de búsqueda
};

/**
 * Mapea el contrato de producto del backend (GET /productos) al formato "product"
 * que ya usan los componentes de la tienda (TireCard, ProductCard, PDP, carrito…).
 * Modelo, medidas y especificaciones pueden venir en null / vacíos (baterías, accesorios).
 */
const mapProducto = (p) => {
  const finalPrice = Number(p.precio) || 0;
  const precioAnterior = p.precioAnterior != null ? Number(p.precioAnterior) : null;
  const imagenes = Array.isArray(p.imagenes) ? p.imagenes : [];
  const principal = imagenes.find((img) => img.esPrincipal) || imagenes[0];
  // Galería: la principal primero y luego el resto en su orden
  const images = principal
    ? [principal.urlImagen, ...imagenes.filter((img) => img !== principal).map((img) => img.urlImagen)]
    : [];

  return {
    fromApi: true,
    // id del producto — se usa en /product/:id y en el carrito
    id: p.idProducto,
    productId: p.idProducto,
    name: p.nombre || 'Sin nombre',
    description: p.descripcion || '',
    category: p.tipoProducto?.nombre || '',
    brand: p.marca?.nombre || '',
    brandLogo: p.marca?.logoUrl || null,
    brandBanner: p.marca?.bannerUrl || null,
    model: p.modelo?.nombre || null,
    modelUse: p.modelo?.tipoUso || null, // { codigo: "AT", descripcion: "All Terrain" }
    measure: p.medidas?.texto || '',
    width: p.medidas?.ancho ?? null,
    height: p.medidas?.alto ?? null,
    rim: p.medidas?.aro ?? null,
    // price = precio de referencia (tachado si hay descuento); finalPrice = lo que paga el cliente
    price: precioAnterior && precioAnterior > finalPrice ? precioAnterior : finalPrice,
    finalPrice,
    discount: p.descuentoPorcentaje || 0,
    image: p.imagenPrincipal || principal?.urlImagen || '/placeholder-tire.png',
    images,
    stock: p.stock ?? 0,
    inStock: Boolean(p.disponible),
    specs: (p.especificaciones || []).map((e) => ({
      id: e.idEspecificacion,
      name: e.nombre,
      icon: e.iconoUrl,
      value: e.valor,
    })),
    isNew: Boolean(p.esNuevo),
    onSale: Boolean(p.enOferta),
    freeShipping: Boolean(p.envioGratis),
    returns: Boolean(p.aplicaDevoluciones),
    warranty: Boolean(p.aplicaGarantia),
    featured: Boolean(p.destacado),
    active: p.activo !== false,
    sash: p.imagenPromocion?.urlImagen || null,
    _raw: p,
  };
};

const mapProductos = (lista) => (Array.isArray(lista) ? lista.map(mapProducto) : []);

const conCache = async (clave, ttl, cargar) => {
  const cached = apiCache.get(clave);
  if (cached) return cached;
  const resultado = await cargar();
  apiCache.set(clave, resultado, ttl);
  return resultado;
};

export const productsService = {
  /**
   * Catálogo completo — GET /productos
   */
  getAllProducts: (params = {}) =>
    conCache(`all-products:${JSON.stringify(params)}`, CACHE_TTL.ALL_PRODUCTS, async () => {
      const response = await api.get('/productos', { params });
      return mapProductos(response.data.data);
    }),

  /**
   * Detalle — GET /productos/:id
   */
  getProductById: (id) =>
    conCache(`product:${id}`, CACHE_TTL.PRODUCT_DETAIL, async () => {
      const response = await api.get(`/productos/${id}`);
      return mapProducto(response.data.data);
    }),

  /**
   * Búsqueda por medida — GET /productos/buscar-medida?ancho=&alto=&aro=
   */
  searchByMeasure: ({ ancho, perfil, rin }) => {
    const params = {};
    if (ancho) params.ancho = ancho;
    if (perfil) params.alto = perfil;
    if (rin) params.aro = rin;
    return conCache(`search-measure:${ancho}-${perfil}-${rin}`, CACHE_TTL.SEARCH_RESULTS, async () => {
      const response = await api.get('/productos/buscar-medida', { params });
      return mapProductos(response.data.data);
    });
  },

  /**
   * Búsqueda por vehículo — GET /productos/buscar-vehiculo?marca=&modelo=&anio=
   */
  searchByVehicle: ({ marca, modelo, anio }) => {
    const params = {};
    if (marca) params.marca = marca;
    if (modelo) params.modelo = modelo;
    if (anio) params.anio = anio;
    return conCache(`search-vehicle:${marca}-${modelo}-${anio}`, CACHE_TTL.SEARCH_RESULTS, async () => {
      const response = await api.get('/productos/buscar-vehiculo', { params });
      return mapProductos(response.data.data);
    });
  },

  /**
   * Búsqueda general (medida "225/75R15", marca, modelo o texto)
   * GET /productos/buscar-general?q=texto — devuelve resultados y recomendaciones
   */
  buscarGeneral: async (q) => {
    if (!q) return { resultados: [], recomendaciones: [], tipo: 'vacio' };
    return conCache(`search-general-text:${q}`, CACHE_TTL.SEARCH_RESULTS, async () => {
      const response = await api.get('/productos/buscar-general', { params: { q } });
      const { resultados, recomendaciones, tipo, parsedMedida, marcaBuscada } = response.data.data;
      return {
        resultados: mapProductos(resultados),
        recomendaciones: mapProductos(recomendaciones),
        tipo,
        parsedMedida,
        marcaBuscada,
      };
    });
  },

  /**
   * Buscar productos con filtros genéricos del frontend
   */
  searchProducts: async (filters = {}) => {
    if (filters.width || filters.height || filters.rim) {
      return productsService.searchByMeasure({ ancho: filters.width, perfil: filters.height, rin: filters.rim });
    }
    if (filters.brand || filters.model || filters.year) {
      return productsService.searchByVehicle({ marca: filters.brand, modelo: filters.model, anio: filters.year });
    }
    const params = {};
    if (filters.category) params.idTipoProducto = filters.category;
    return productsService.getAllProducts(params);
  },
};

export { mapProducto, mapProductos };
export default productsService;
