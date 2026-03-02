import api from './api';
import mockProductsService from './mock/products.mock.js';

// Usar mock service si VITE_USE_MOCK está habilitado
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const productsService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    if (USE_MOCK) {
      const response = await mockProductsService.getAllProducts();
      return response.data;
    }

    const response = await api.get('/products');
    return response.data;
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    if (USE_MOCK) {
      const response = await mockProductsService.getProductById(id);
      return response.data;
    }

    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Buscar productos por filtros
  searchProducts: async (filters) => {
    if (USE_MOCK) {
      const response = await mockProductsService.searchProducts(filters);
      return response.data;
    }

    const response = await api.get('/products/search', {
      params: filters,
    });
    return response.data;
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    if (USE_MOCK) {
      const response = await mockProductsService.getProductsByCategory(category);
      return response.data;
    }

    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Obtener marcas disponibles
  getBrands: async () => {
    if (USE_MOCK) {
      const response = await mockProductsService.getBrands();
      return response.data;
    }

    const response = await api.get('/brands');
    return response.data;
  },

  // Buscar por texto
  searchByText: async (query) => {
    if (USE_MOCK) {
      const response = await mockProductsService.searchByText(query);
      return response.data;
    }

    const response = await api.get('/products/search/text', {
      params: { q: query },
    });
    return response.data;
  },
};

export default productsService;

