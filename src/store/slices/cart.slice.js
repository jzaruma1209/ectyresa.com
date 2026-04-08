// Fase 4 — Cart Slice actualizado para trabajar con el backend
// Las acciones ahora esperan la respuesta completa del servidor,
// no calculan totales en el frontend (Reglas 4.4 y 4.6).

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import carritoService from '../../services/cart.service';

// ── Thunks ───────────────────────────────────────────────────────────────────

/** Carga el carrito desde el backend al iniciar la app */
export const fetchCarrito = createAsyncThunk(
  'cart/fetchCarrito',
  async (_, { rejectWithValue }) => {
    try {
      return await carritoService.getCarrito();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar el carrito');
    }
  }
);

/** Agrega un producto al carrito en el backend */
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ idLlanta, cantidad = 1 }, { rejectWithValue }) => {
    try {
      return await carritoService.agregarItem(idLlanta, cantidad);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al agregar al carrito');
    }
  }
);

/** Actualiza la cantidad de un item en el backend */
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async ({ cartItemId, cantidad }, { rejectWithValue }) => {
    try {
      return await carritoService.actualizarItem(cartItemId, cantidad);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar cantidad');
    }
  }
);

/** Elimina un item del carrito en el backend */
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (cartItemId, { rejectWithValue }) => {
    try {
      return await carritoService.eliminarItem(cartItemId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar item');
    }
  }
);

/** Vacía el carrito completo en el backend */
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      return await carritoService.vaciarCarrito();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al vaciar el carrito');
    }
  }
);

// ── Helper: aplica la respuesta del backend al estado ────────────────────────
const applyCartResponse = (state, cartData) => {
  state.items = cartData.items;
  state.subtotal = cartData.subtotal;
  state.iva = cartData.iva;
  state.total = cartData.total;
  state.itemCount = cartData.itemCount;
  state.loading = false;
  state.error = null;
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    iva: 0,
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Limpieza local inmediata del store (sin llamada al backend).
    // Usada tras checkout exitoso: el backend ya marcó el carrito como CONVERTIDO.
    clearCartLocal: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.iva = 0;
      state.total = 0;
      state.itemCount = 0;
      state.error = null;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchCarrito ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchCarrito.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        applyCartResponse(state, action.payload);
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── addToCartAsync ───────────────────────────────────────────────────────
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        applyCartResponse(state, action.payload);
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── updateQuantityAsync ──────────────────────────────────────────────────
    builder
      .addCase(updateQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        applyCartResponse(state, action.payload);
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── removeFromCartAsync ──────────────────────────────────────────────────
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        applyCartResponse(state, action.payload);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── clearCartAsync ───────────────────────────────────────────────────────
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        applyCartResponse(state, action.payload);
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartLocal, clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
