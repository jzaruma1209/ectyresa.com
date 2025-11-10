import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/products.slice";
import cartReducer from "./slices/cart.slice";
import filtersReducer from "./slices/filters.slice";
import uiReducer from "./slices/ui.slice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
});

export default store;
