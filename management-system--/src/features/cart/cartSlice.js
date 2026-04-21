import { createSlice } from "@reduxjs/toolkit";
import { loadCartState } from "../../utils/cartStorage";

const savedState = loadCartState();
// Initial cart state (one cart per user)
const initialState = {
  cartsByUser: savedState?.cartsByUser || {
    guest: {
      items: [],
      promoCode: "",
      discountRate: 0,
      promoMessage: "",
      promoError: "",
    },
  },
  isDrawerOpen: false, // UI state for cart drawer
};

// Helper: make sure user always has a cart
const getUserCart = (state, username) => {
  if (!state.cartsByUser[username]) {
    state.cartsByUser[username] = {
      items: [],
      promoCode: "",
      discountRate: 0,
      promoMessage: "",
      promoError: "",
    };
  }
  return state.cartsByUser[username];
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // UI control for drawer
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    // Add item or increase quantity if already exists
    addToCart: (state, action) => {
      const { username, product } = action.payload;
      const userCart = getUserCart(state, username);

      const existingItem = userCart.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        userCart.items.push({ ...product, quantity: 1 });
      }
    },
    // Increase quantity
    increaseQuantity: (state, action) => {
      const { username, productId } = action.payload;
      const userCart = getUserCart(state, username);

      const item = userCart.items.find((item) => item.id === productId);
      if (item) {
        item.quantity += 1;
      }
    },
    // Decrease quantity or remove if 0
    decreaseQuantity: (state, action) => {
      const { username, productId } = action.payload;
      const userCart = getUserCart(state, username);

      const item = userCart.items.find((item) => item.id === productId);
      if (item) {
        item.quantity -= 1;
      }
      // if the quatity is 0, we should remove it
      userCart.items = userCart.items.filter((item) => item.quantity > 0);
    },
    // Remove item completely
    removeFromCart: (state, action) => {
      const { username, productId } = action.payload;
      const userCart = getUserCart(state, username);

      userCart.items = userCart.items.filter((item) => item.id !== productId);
    },
    // Reset cart to empty
    clearCart: (state, action) => {
      const username = action.payload;
      const userCart = getUserCart(state, username);

      userCart.items = [];
      userCart.promoCode = "";
      userCart.discountRate = 0;
      userCart.promoMessage = "";
      userCart.promoError = "";
    },

    // Apply promo code (hardcoded for demo)
    applyPromoCode: (state, action) => {
      const { username, code } = action.payload;
      const userCart = getUserCart(state, username);

      const normalizedCode = code.trim().toUpperCase();

      if (normalizedCode === "SAVE10") {
        userCart.promoCode = normalizedCode;
        userCart.discountRate = 0.1;
        userCart.promoMessage = "Promo code applied successfully.";
        userCart.promoError = "";
      } else if (normalizedCode === "SAVE20") {
        userCart.promoCode = normalizedCode;
        userCart.discountRate = 0.2;
        userCart.promoMessage = "Promo code applied successfully.";
        userCart.promoError = "";
      } else {
        userCart.promoCode = "";
        userCart.discountRate = 0;
        userCart.promoMessage = "";
        userCart.promoError = "Invalid promo code.";
      }
    },

    // Clear temporary UI messages
    clearPromoFeedback: (state, action) => {
      const username = action.payload;
      const userCart = getUserCart(state, username);

      userCart.promoMessage = "";
      userCart.promoError = "";
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyPromoCode,
  clearPromoFeedback,
} = cartSlice.actions;

export default cartSlice.reducer;