import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setProducts,
  setLoading,
  setError,
  setSelectedProduct,
} from '../store/slices/products.slice';
import productsService from '../services/products.service';

/**
 * Extrae el mensaje de error legible del backend o del error genérico
 */
const getErrorMessage = (err) => {
  return err.response?.data?.message || err.message || 'Error desconocido';
};

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, selectedProduct } = useSelector(
    (state) => state.products
  );

  // Cargar todos los productos (llantas)
  const loadProducts = useCallback(async (params = {}) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await productsService.getAllProducts(params);
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(getErrorMessage(err)));
    }
  }, [dispatch]);

  // Cargar producto por ID
  const loadProductById = useCallback(async (id) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await productsService.getProductById(id);
      dispatch(setSelectedProduct(data));
    } catch (err) {
      dispatch(setError(getErrorMessage(err)));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // Buscar productos con filtros genéricos
  const searchProducts = useCallback(async (filters) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await productsService.searchProducts(filters);
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(getErrorMessage(err)));
    }
  }, [dispatch]);

  // Buscar por medida (ancho/perfil/rin)
  const searchByMeasure = useCallback(async ({ width, height, rim }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await productsService.searchByMeasure({
        ancho: width,
        perfil: height,
        rin: rim,
      });
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(getErrorMessage(err)));
    }
  }, [dispatch]);

  // Buscar por vehículo (marca/modelo/año)
  const searchByVehicle = useCallback(async ({ brand, model, year }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await productsService.searchByVehicle({
        marca: brand,
        modelo: model,
        anio: year,
      });
      dispatch(setProducts(data));
    } catch (err) {
      dispatch(setError(getErrorMessage(err)));
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
    searchByMeasure,
    searchByVehicle,
    setSelectedProduct: (product) => dispatch(setSelectedProduct(product)),
  };
};

export default useProducts;
