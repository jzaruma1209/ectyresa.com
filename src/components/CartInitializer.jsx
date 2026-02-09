import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadCartFromStorage } from '../store/slices/cart.slice';
import cartService from '../services/cart.service';

/**
 * Componente que inicializa el carrito desde localStorage.
 * Debe usarse una sola vez en App.jsx para evitar múltiples cargas.
 */
const CartInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedCart = cartService.loadCart();
    if (savedCart) {
      dispatch(loadCartFromStorage(savedCart));
    }
  }, [dispatch]);

  return null; // Este componente no renderiza nada
};

export default CartInitializer;
