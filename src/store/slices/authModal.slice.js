// ═══════════════════════════════════════════════════════
// authModal.slice.js — Modal flotante de autenticación
// Maneja el estado del modal de login cuando el usuario
// intenta hacer una acción que requiere autenticación.
// Guarda la pendingAction para ejecutarla post-login.
// ═══════════════════════════════════════════════════════

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  // pendingAction: { type: 'ADD_TO_CART' | 'CHECKOUT', payload: any }
  pendingAction: null,
};

const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.isOpen = true;
      state.pendingAction = action.payload || null;
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
      state.pendingAction = null;
    },
    clearPendingAction: (state) => {
      state.pendingAction = null;
    },
  },
});

export const { openAuthModal, closeAuthModal, clearPendingAction } = authModalSlice.actions;
export default authModalSlice.reducer;
