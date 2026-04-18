'use client';

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, AuthUser } from '@/types';
import { localSet, localGet, localRemove } from '@/lib/helpers';
import Cookies from 'js-cookie';

// ─── Async thunks ────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    // Mock auth — replace with real API call
    await new Promise((r) => setTimeout(r, 800));

    if (
      credentials.email === 'admin@school.com' &&
      credentials.password === 'password123'
    ) {
      const user: AuthUser = {
        id: '1',
        email: 'admin@school.com',
        name: 'Sister Mary',
        role: 'admin',
      };
      const token = 'mock-jwt-token-' + Date.now();
      return { user, token };
    }

    return rejectWithValue('Invalid email or password');
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localRemove('auth_token');
  localRemove('auth_user');
  Cookies.remove('auth_token');
});

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Rehydrate auth state from localStorage on app boot */
    rehydrate(state) {
      const token = localGet<string>('auth_token');
      const user = localGet<AuthUser>('auth_user');
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // Persist to localStorage + cookie for middleware
        localSet('auth_token', action.payload.token);
        localSet('auth_user', action.payload.user);
        Cookies.set('auth_token', action.payload.token, { expires: 7 });
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { rehydrate, clearAuth } = authSlice.actions;
export default authSlice.reducer;
