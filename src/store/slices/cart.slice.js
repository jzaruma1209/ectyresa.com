import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId,
          product,
          quantity,
        });
      }

      // Recalcular totales
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => {
        const price = item.product.finalPrice || item.product.price;
        return sum + (price * item.quantity);
      }, 0);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);

      // Recalcular totales
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => {
        const price = item.product.finalPrice || item.product.price;
        return sum + (price * item.quantity);
      }, 0);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }

      // Recalcular totales
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => {
        const price = item.product.finalPrice || item.product.price;
        return sum + (price * item.quantity);
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    loadCartFromStorage: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
      state.itemCount = action.payload.itemCount || 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;

