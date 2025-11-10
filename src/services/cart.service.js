// Servicio para manejar el carrito en localStorage

const CART_STORAGE_KEY = 'ectyre_cart';

export const cartService = {
  // Guardar carrito en localStorage
  saveCart: (cartData) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  // Cargar carrito desde localStorage
  loadCart: () => {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : null;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return null;
    }
  },

  // Limpiar carrito de localStorage
  clearCart: () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  },
};

export default cartService;

