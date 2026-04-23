const AUTH_STORAGE_KEY = "auth";

export function saveAuthToStorage(authData) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

export function getAuthFromStorage() {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export function clearAuthFromStorage() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}