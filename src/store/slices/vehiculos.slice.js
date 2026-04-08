// Fase 3 — Slice de Vehículos (Redux)
// Maneja el estado de marcas y modelos cargados desde el backend

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vehiculosService from '../../services/vehiculos.service';

// ── Thunks ───────────────────────────────────────────────────────────────────

/**
 * Carga todas las marcas con sus modelos anidados desde el backend.
 */
export const fetchMarcas = createAsyncThunk(
  'vehiculos/fetchMarcas',
  async (_, { rejectWithValue }) => {
    try {
      const data = await vehiculosService.getMarcasCompleto();
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar las marcas';
      return rejectWithValue(message);
    }
  }
);

/**
 * Carga los modelos de una marca específica por su ID.
 */
export const fetchModelosPorMarca = createAsyncThunk(
  'vehiculos/fetchModelosPorMarca',
  async (idMarca, { rejectWithValue }) => {
    try {
      const data = await vehiculosService.getModelosPorMarca(idMarca);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Error al cargar los modelos';
      return rejectWithValue(message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const vehiculosSlice = createSlice({
  name: 'vehiculos',
  initialState: {
    marcas: [],       // [ { idMarca, nombre, modelos: [{idModelo, nombre}] } ]
    modelos: [],      // [ { idModelo, nombre } ] — de la marca seleccionada
    loading: false,
    error: null,
  },
  reducers: {
    // Resetea los modelos cuando el usuario cambia de marca
    resetModelos: (state) => {
      state.modelos = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMarcas
    builder
      .addCase(fetchMarcas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarcas.fulfilled, (state, action) => {
        state.loading = false;
        state.marcas = action.payload;
      })
      .addCase(fetchMarcas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchModelosPorMarca
    builder
      .addCase(fetchModelosPorMarca.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelosPorMarca.fulfilled, (state, action) => {
        state.loading = false;
        state.modelos = action.payload;
      })
      .addCase(fetchModelosPorMarca.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetModelos, clearError } = vehiculosSlice.actions;

export default vehiculosSlice.reducer;
