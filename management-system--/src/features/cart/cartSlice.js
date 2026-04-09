import { createSlice } from "@reduxjs/toolkit";
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  cartItems: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }

      saveCartToLocalStorage(state.cartItems);
    },

    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find((item) => item.id === productId);

      if (item) {
        item.quantity += 1;
      }

      saveCartToLocalStorage(state.cartItems);
    },

    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartItems.find((item) => item.id === productId);

      if (item) {
        item.quantity -= 1;
      }

      state.cartItems = state.cartItems.filter((item) => item.quantity > 0);

      saveCartToLocalStorage(state.cartItems);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== productId);

      saveCartToLocalStorage(state.cartItems);
    },

    clearCart: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;