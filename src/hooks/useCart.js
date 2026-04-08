// Fase 4 — useCart actualizado para usar el backend
// Expone la misma API pública que antes para no romper los componentes existentes.

import { useSelector, useDispatch } from 'react-redux';
import {
  addToCartAsync,
  removeFromCartAsync,
  updateQuantityAsync,
  clearCartAsync,
  clearCartLocal,
  clearCartError,
} from '../store/slices/cart.slice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  /**
   * Agrega un producto al carrito.
   * Internamente llama al backend con { idLlanta, cantidad }.
   * product.id ES el idLlanta del backend (Regla RG-6).
   */
  const handleAddToCart = async (product, quantity = 1) => {
    await dispatch(addToCartAsync({ idLlanta: product.id, cantidad: quantity }));
  };

  /**
   * Elimina un item del carrito.
   * Recibe el cartItemId (idItem del backend), no el productId.
   * CartItem.jsx usa item.cartItemId para llamar a esta función.
   */
  const handleRemoveFromCart = async (cartItemId) => {
    await dispatch(removeFromCartAsync(cartItemId));
  };

  /**
   * Actualiza la cantidad de un item.
   * Si la nueva cantidad es 0, elimina el item directamente.
   */
  const handleUpdateQuantity = async (cartItemId, cantidad) => {
    if (cantidad <= 0) {
      await dispatch(removeFromCartAsync(cartItemId));
    } else {
      await dispatch(updateQuantityAsync({ cartItemId, cantidad }));
    }
  };

  /**
   * Vacía el carrito completo en el backend.
   */
  const handleClearCart = async () => {
    await dispatch(clearCartAsync());
  };

  /**
   * Limpia el carrito localmente en Redux (sin llamar al backend).
   * Usar solo tras un checkout exitoso (el backend ya lo marcó como CONVERTIDO).
   */
  const handleClearCartLocal = () => {
    dispatch(clearCartLocal());
  };

  const handleClearError = () => {
    dispatch(clearCartError());
  };

  return {
    // Estado
    cart,
    items: cart.items,
    itemCount: cart.itemCount,
    loading: cart.loading,
    error: cart.error,

    // Totales del backend (Regla 4.6) — NO se calculan en frontend
    subtotal: cart.subtotal,
    iva: cart.iva,
    total: cart.total,

    // Compatibilidad con componentes que usaban 'totalWithIVA'
    totalWithIVA: cart.total,

    // Acciones
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    clearCartLocal: handleClearCartLocal,
    clearError: handleClearError,
  };
};

export default useCart;
