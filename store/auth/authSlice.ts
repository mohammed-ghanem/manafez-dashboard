/* eslint-disable @typescript-eslint/no-explicit-any */
/* store/auth/authSlice.ts */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ActLogin,
  ActLogout,
  ActSendResetCode,
  ActVerifyCode,
  ActResetPassword
} from "./thunkActions/ActAuth";
import { ActFetchProfile, ActUpdateProfile } from "./thunkActions/ActUser";
 
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
    resetAuthState: () => initialState, // ✅ new reducer to reset everything
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login
      .addCase(ActLogin.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(
        ActLogin.fulfilled,
        (s, a: PayloadAction<{ user: IUser; token: string }>) => {
          s.status = "succeeded";
          s.user = a.payload.user;
          s.token = a.payload.token;
        }
      )
      .addCase(ActLogin.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Login failed";
      })

      // 🚪 Logout
      .addCase(ActLogout.fulfilled, () => initialState)

      // 📧 Send Reset Code
      .addCase(ActSendResetCode.pending, (s) => {
        s.status = "loading";
        s.error = null;
        s.resetMessage = null;
      })
      .addCase(ActSendResetCode.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.resetMessage = a.payload?.message || "Code sent";
      })
      .addCase(ActSendResetCode.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Failed to send code";
      })

      // ✅ Verify Code
      .addCase(ActVerifyCode.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(ActVerifyCode.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.resetMessage = a.payload?.message || "Code verified";
      })
      .addCase(ActVerifyCode.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Verification failed";
      })

      // 🔑 Reset Password
      .addCase(ActResetPassword.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(ActResetPassword.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.resetMessage = a.payload?.message || "Password reset succeeded";
      })
      .addCase(ActResetPassword.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Reset failed";
      })
      // 👤 Get Profile
      .addCase(ActFetchProfile.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(ActFetchProfile.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = (a.payload as any)?.user || (a.payload as any)?.data || a.payload;
        s.error = null;
      })
      .addCase(ActFetchProfile.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Failed to fetch profile";
      })

      // ✏️ Update Profile
      .addCase(ActUpdateProfile.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(ActUpdateProfile.fulfilled, (s, a) => {
        s.status = "succeeded";

        // Extract updated user info safely (handle both response structures)
        const updatedUser =
          (a.payload as { user?: IUser; data?: IUser })?.user ||
          (a.payload as { data?: IUser })?.data ||
          (a.payload as IUser);

        // Merge new data with existing user to keep unchanged fields
        s.user = { ...s.user, ...updatedUser };
        s.error = null;
      })
      .addCase(ActUpdateProfile.rejected, (s, a) => {
        s.status = "failed";
        s.error =
          (a.payload as string) || a.error?.message || "Failed to update profile";
      });

  }
});

export const { clearAuthError, clearResetMessage, resetAuthState } = authSlice.actions;
export default authSlice.reducer;