import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  signInApi,
  signUpApi,
  updatePasswordApi,
  logOutApi,
} from '../../api/authApi';
import { getAuthFromStorage } from '../../utils/authStorage';

const savedAuth = getAuthFromStorage();

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || '',
  isAuthenticated: savedAuth?.isAuthenticated || false,
  loading: false,
  error: '',
  successMessage: '',
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await signInApi(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await signUpApi(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updatePasswordApi(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Update password failed');
    }
  }
);

export const logOut = createAsyncThunk(
  'auth/logOut',
  async (_, { rejectWithValue }) => {
    try {
      const data = await logOutApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessage(state) {
      state.error = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.successMessage = '';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message || 'Sign in successful';
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.successMessage = '';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.successMessage = action.payload.message || 'Signup successful';
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.successMessage = '';
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || 'Reset request accepted';
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.successMessage = '';
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = '';
        state.isAuthenticated = false;
        state.successMessage = action.payload.message || 'Logout successful';
      })
      .addCase(logOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;