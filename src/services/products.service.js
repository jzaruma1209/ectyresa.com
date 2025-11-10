import api from './api';

export const productsService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar productos por filtros
  searchProducts: async (filters) => {
    try {
      const response = await api.get('/products/search', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productsService;

