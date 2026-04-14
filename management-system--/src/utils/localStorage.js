// Read cart data from localStorage
export function loadCartState() {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
}

// Save cart data to localStorage
export function saveCartState(state) {
  try {
    const stateToSave = {
      cartsByUser: state.cartsByUser,
    };
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem("cartState", serializedState);
  } catch (error) {
    // Ignore write errors
  }
}