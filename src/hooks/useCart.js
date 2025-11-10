import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromStorage,
} from '../store/slices/cart.slice';
import cartService from '../services/cart.service';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = cartService.loadCart();
    if (savedCart) {
      dispatch(loadCartFromStorage(savedCart));
    }
  }, [dispatch]);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cart.items.length > 0 || cart.total > 0) {
      cartService.saveCart({
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
      });
    } else {
      cartService.clearCart();
    }
  }, [cart.items, cart.total, cart.itemCount]);

  const handleAddToCart = (product, quantity = 1) => {
    dispatch(addToCart({
      productId: product.id,
      product,
      quantity,
    }));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    cartService.clearCart();
  };

  // Calcular total con IVA (16% en México)
  const calculateTotalWithIVA = () => {
    const iva = 0.16;
    return cart.total * (1 + iva);
  };

  return {
    cart,
    items: cart.items,
    total: cart.total,
    itemCount: cart.itemCount,
    totalWithIVA: calculateTotalWithIVA(),
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};

export default useCart;

