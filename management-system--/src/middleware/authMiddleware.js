import {
  saveAuthToStorage,
  clearAuthFromStorage,
} from '../utils/localStorage.js';
import { signIn, signUp, logOut } from '../features/auth/authSlice.js';

const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (signIn.fulfilled.match(action) || signUp.fulfilled.match(action)) {
    const { user, token, isAuthenticated } = store.getState().auth;

    saveAuthToStorage({
      user,
      token,
      isAuthenticated,
    });
  }

  if (logOut.fulfilled.match(action)) {
    clearAuthFromStorage();
  }

  return result;
};

export default authMiddleware;