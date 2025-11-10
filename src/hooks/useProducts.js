import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setProducts,
  setLoading,
  setError,
  setSelectedProduct,
} from '../store/slices/products.slice';
import productsService from '../services/products.service';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, selectedProduct } = useSelector(
    (state) => state.products
  );

  // Cargar todos los productos
  const loadProducts = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const data = await productsService.getAllProducts();
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [dispatch]);

  // Cargar producto por ID
  const loadProductById = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      const data = await productsService.getProductById(id);
      dispatch(setSelectedProduct(data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [dispatch]);

  // Buscar productos con filtros
  const searchProducts = useCallback(async (filters) => {
    try {
      dispatch(setLoading(true));
      const data = await productsService.searchProducts(filters);
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }, [dispatch]);

  return {
    products,
    loading,
    error,
    selectedProduct,
    loadProducts,
    loadProductById,
    searchProducts,
    setSelectedProduct: (product) => dispatch(setSelectedProduct(product)),
  };
};

export default useProducts;

