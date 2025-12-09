// src/store/auth/authSlice.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActLogin } from "./thunkActions/ActAuth";
import { ActFetchProfile, ActUpdateProfile } from "./thunkActions/ActUser"; // ActUpdateProfile if exists

interface IUser {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
  mobile?: string;
  roles?: string;
}

interface IAuthState {
  user: IUser | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  resetMessage: string | null;
}

const initialState: IAuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  resetMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearResetMessage: (state) => { 
      state.resetMessage = null;
    },
    resetAuthState: () => initialState,
    // explicit client-side hydration: dispatch from Providers with cookie values
    setAuthFromClient: (state, action: PayloadAction<{ user?: any | null; token?: string | null }>) => {
      state.token = action.payload.token ?? state.token;
      if (action.payload.user !== undefined) state.user = action.payload.user;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(ActLogin.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(ActLogin.fulfilled, (s, a: PayloadAction<{ user: any; token: string }>) => {
        s.status = "succeeded";
        s.user = a.payload.user ?? null;
        s.token = a.payload.token ?? null;
        s.error = null;
      })
      .addCase(ActLogin.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Login failed";
      });

    // Fetch profile
    builder
      .addCase(ActFetchProfile.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(ActFetchProfile.fulfilled, (s, a: PayloadAction<any>) => {
        s.status = "succeeded";
        // normalize payload that might be either user object or { user } or { data }
        const payload = a.payload;
        s.user = payload?.user ?? payload?.data ?? payload ?? null;
        s.error = null;
      })
      .addCase(ActFetchProfile.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Failed to fetch profile";
      });

    // Update profile (optional - provided if you have ActUpdateProfile)
    if (ActUpdateProfile) {
      builder
        .addCase(ActUpdateProfile.pending, (s) => {
          s.status = "loading";
          s.error = null;
        })
        .addCase(ActUpdateProfile.fulfilled, (s, a: PayloadAction<any>) => {
          s.status = "succeeded";
          const updatedUser = a.payload?.user ?? a.payload?.data ?? a.payload ?? null;
          s.user = { ...s.user, ...updatedUser };
          s.error = null;
        })
        .addCase(ActUpdateProfile.rejected, (s, a) => {
          s.status = "failed";
          s.error = (a.payload as string) || a.error?.message || "Failed to update profile";
        });
    }
  },
});

export const { clearAuthError, clearResetMessage, resetAuthState, setAuthFromClient, clearCredentials } = authSlice.actions;
export default authSlice.reducer;