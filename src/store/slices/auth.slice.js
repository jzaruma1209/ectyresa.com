import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants';

// Intentar restaurar el token desde localStorage al inicializar
const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN) || null;

const initialState = {
  user: null,
  token: savedToken,
  loading: false,
  error: null,
  isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user || state.user;
      state.token = token || state.token;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;

      // Persistir token en localStorage
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
