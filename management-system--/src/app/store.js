import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import { saveCartState } from "../utils/localStorage";

// Create global Redux store
// All shared state (like cart) lives here
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
// Save cart to localStorage whenever state changes
store.subscribe(() => {
  saveCartState(store.getState().cart);
});