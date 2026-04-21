import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import { saveCartState } from "../utils/cartStorage";

import authReducer from "../features/auth/authSlice";
import authMiddleware from "../middleware/authMiddleware";

// Create global Redux store
// All shared state (like cart) lives here
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
// Save cart to localStorage whenever state changes
store.subscribe(() => {
  saveCartState(store.getState().cart);
});