import mockProducts from '../../data/products.mock.json';

// Simular delay de red (300ms)
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const mockProductsService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    await simulateDelay();
    return {
      data: mockProducts,
      status: 200,
      message: 'Productos obtenidos exitosamente'
    };
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    await simulateDelay();
    const product = mockProducts.find(p => p.id === parseInt(id));
    
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    
    return {
      data: product,
      status: 200,
      message: 'Producto encontrado'
    };
  },

  // Buscar productos por filtros
  searchProducts: async (filters) => {
    await simulateDelay();
    
    let filteredProducts = [...mockProducts];
    
    // Filtrar por medida
    if (filters.width) {
      filteredProducts = filteredProducts.filter(p => 
        p.specs.width === parseInt(filters.width)
      );
    }
    
    if (filters.height) {
      filteredProducts = filteredProducts.filter(p => 
        p.specs.height === parseInt(filters.height)
      );
    }
    
    if (filters.rim) {
      filteredProducts = filteredProducts.filter(p => 
        p.specs.rim === parseInt(filters.rim)
      );
    }
    
    // Filtrar por categoría
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category === filters.category
      );
    }
    
    // Filtrar por terreno
    if (filters.terrain) {
      filteredProducts = filteredProducts.filter(p => 
        p.terrain === filters.terrain
      );
    }
    
    // Filtrar por marca
    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    
    // Filtrar por precio
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => 
        p.finalPrice >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => 
        p.finalPrice <= parseFloat(filters.maxPrice)
      );
    }
    
    // Ordenar resultados
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.finalPrice - b.finalPrice);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.finalPrice - a.finalPrice);
          break;
        case 'name':
        default:
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }
    
    return {
      data: filteredProducts,
      status: 200,
      message: `${filteredProducts.length} productos encontrados`,
      filters: filters
    };
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    await simulateDelay();
    
    const filteredProducts = mockProducts.filter(p => p.category === category);
    
    return {
      data: filteredProducts,
      status: 200,
      message: `Productos de categoría ${category}`,
    };
  },

  // Obtener marcas disponibles
  getBrands: async () => {
    await simulateDelay();
    
    const brands = [...new Set(mockProducts.map(p => p.brand))].sort();
    
    return {
      data: brands,
      status: 200,
      message: 'Marcas disponibles'
    };
  },

  // Buscar productos por texto
  searchByText: async (query) => {
    await simulateDelay();
    
    const searchTerm = query.toLowerCase();
    const filteredProducts = mockProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.model.toLowerCase().includes(searchTerm) ||
      p.measure.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
    
    return {
      data: filteredProducts,
      status: 200,
      message: `Búsqueda: "${query}" - ${filteredProducts.length} resultados`
    };
  }
};

export default mockProductsService;