import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Filtros de medida
  width: null,
  height: null,
  rim: null,
  // Filtros de vehículo
  brand: null,
  model: null,
  year: null,
  // Filtros de categoría
  category: null, // autos, motos, camiones
  terrain: null, // asfalto, todo-terreno, carga
  // Otros filtros
  minPrice: null,
  maxPrice: null,
  sortBy: 'name', // name, price-asc, price-desc
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMeasureFilter: (state, action) => {
      const { width, height, rim } = action.payload;
      if (width !== undefined) state.width = width;
      if (height !== undefined) state.height = height;
      if (rim !== undefined) state.rim = rim;
    },
    setVehicleFilter: (state, action) => {
      const { brand, model, year } = action.payload;
      if (brand !== undefined) state.brand = brand;
      if (model !== undefined) state.model = model;
      if (year !== undefined) state.year = year;
    },
    setCategoryFilter: (state, action) => {
      state.category = action.payload;
    },
    setTerrainFilter: (state, action) => {
      state.terrain = action.payload;
    },
    setPriceFilter: (state, action) => {
      const { minPrice, maxPrice } = action.payload;
      if (minPrice !== undefined) state.minPrice = minPrice;
      if (maxPrice !== undefined) state.maxPrice = maxPrice;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      return initialState;
    },
  },
});

export const {
  setMeasureFilter,
  setVehicleFilter,
  setCategoryFilter,
  setTerrainFilter,
  setPriceFilter,
  setSortBy,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

