import { createSlice } from "@reduxjs/toolkit";

/*
  Initial cart state
*/
const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /*
      Add product to cart
      - if exists: quantity +1
      - if not exists: add with quantity 1
    */
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    /*
      Increase quantity by 1
    */
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    /*
      Decrease quantity by 1
      Remove item if quantity becomes 0
    */
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (cartItem) => cartItem.id === action.payload
      );

      if (item) {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== action.payload
          );
        }
      }
    },

    /*
      Remove one product from cart directly
    */
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    /*
      Remove all products from cart
    */
    clearCart: (state) => {
      state.cartItems = [];
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

/*
  Reusable selectors
  These help other pages/components read cart data more cleanly
*/
export const selectCartItems = (state) => state.cart.cartItems;

export const selectTotalItems = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.cart.cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

export default cartSlice.reducer;