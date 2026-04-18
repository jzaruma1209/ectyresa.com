import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/products.slice";
import cartReducer from "./slices/cart.slice";
import filtersReducer from "./slices/filters.slice";
import uiReducer from "./slices/ui.slice";
import authReducer from "./slices/auth.slice";
import vehiculosReducer from "./slices/vehiculos.slice";
import authModalReducer from "./slices/authModal.slice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    filters: filtersReducer,
    ui: uiReducer,
    auth: authReducer,
    vehiculos: vehiculosReducer,
    authModal: authModalReducer,
  },
});

export default store;
