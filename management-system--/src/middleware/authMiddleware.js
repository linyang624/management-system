import {
  saveAuthToStorage,
  clearAuthFromStorage,
} from "../utils/authStorage.js";
import { signIn, logOut } from "../features/auth/authSlice.js";

const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (signIn.fulfilled.match(action)) {
    const { user, token, isAuthenticated } = store.getState().auth;

    saveAuthToStorage({
      user,
      token,
      isAuthenticated,
    });
  }

  if (logOut.fulfilled.match(action) || logOut.rejected.match(action)) {
    clearAuthFromStorage();
  }

  return result;
};

export default authMiddleware;