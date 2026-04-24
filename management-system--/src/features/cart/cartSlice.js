import { createSlice } from "@reduxjs/toolkit";
import { loadCartState } from "../../utils/cartStorage";

// Load saved cart data from localStorage if it exists
const savedState = loadCartState();

/*
  Initial cart state

  cartsByUser:
  - stores a separate cart for each user
  - key = username or email
  - value = that user's cart data

  guest:
  - default cart used when no signed-in user exists
*/
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

  // UI state for showing or hiding the cart drawer
  isDrawerOpen: false,
};

/*
  Helper function:
  Make sure the current user always has a cart object.

  If the user does not already exist in cartsByUser,
  create an empty cart for that user.
*/
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
    /*
      Open cart drawer
    */
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    /*
      Close cart drawer
    */
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    /*
      Add product to user's cart

      Behavior:
      - if product already exists, increase quantity by 1
      - if product does not exist, add it with quantity = 1
    */
    addToCart: (state, action) => {
      const { username, product } = action.payload;
      const userCart = getUserCart(state, username);

      const existingItem = userCart.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        userCart.items.push({ ...product, quantity: 1 });
      }
    },

    /*
      Increase quantity of one product by 1
    */
    increaseQuantity: (state, action) => {
      const { username, productId } = action.payload;
      const userCart = getUserCart(state, username);

      const item = userCart.items.find((item) => item.id === productId);

      if (item) {
        item.quantity += 1;
      }
    },

    /*
      Decrease quantity of one product by 1

      If quantity becomes 0, remove the item from the cart
    */
    decreaseQuantity: (state, action) => {
      const { username, productId } = action.payload;
      const userCart = getUserCart(state, username);

      const item = userCart.items.find((item) => item.id === productId);

      if (item) {
        item.quantity -= 1;
      }

      // Remove items whose quantity is now 0 or less
      userCart.items = userCart.items.filter((item) => item.quantity > 0);
    },

    /*
      Remove one product completely from cart
    */
    removeFromCart: (state, action) => {
      const { username, productId } = action.payload;
      const userCart = getUserCart(state, username);

      userCart.items = userCart.items.filter((item) => item.id !== productId);
    },

    /*
      Clear all items and promo info from one user's cart
    */
    clearCart: (state, action) => {
      const username = action.payload;
      const userCart = getUserCart(state, username);

      userCart.items = [];
      userCart.promoCode = "";
      userCart.discountRate = 0;
      userCart.promoMessage = "";
      userCart.promoError = "";
    },

    /*
      Apply promo code

      Demo promo codes:
      - SAVE10 => 10% discount
      - SAVE20 => 20% discount
    */
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

    /*
      Clear temporary promo success/error messages
    */
    clearPromoFeedback: (state, action) => {
      const username = action.payload;
      const userCart = getUserCart(state, username);

      userCart.promoMessage = "";
      userCart.promoError = "";
    },

    removeProductFromAllCarts: (state, action) => {
      const productId = action.payload;

      Object.keys(state.cartsByUser).forEach((username) => {
        state.cartsByUser[username].items = state.cartsByUser[
          username
        ].items.filter((item) => item.id !== productId);
      });
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
  removeProductFromAllCarts,
} = cartSlice.actions;

/*
  Selectors
  These make page code cleaner and reusable
*/

// Get one user's full cart object safely
export const selectUserCart = (state, username) =>
  state.cart.cartsByUser?.[username] || {
    items: [],
    promoCode: "",
    discountRate: 0,
    promoMessage: "",
    promoError: "",
  };

// Get one user's cart items
export const selectCartItems = (state, username) =>
  selectUserCart(state, username).items;

// Get total quantity of items in one user's cart
export const selectTotalItems = (state, username) =>
  selectUserCart(state, username).items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

// Get total raw price of items in one user's cart
export const selectTotalPrice = (state, username) =>
  selectUserCart(state, username).items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

export default cartSlice.reducer;