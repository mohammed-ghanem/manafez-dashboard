/* store/auth/authSlice.ts */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActLogin, ActLogout, ActSendResetCode, ActVerifyCode, ActResetPassword } from "./thunkActions/ActAuth";

interface IUser { id?: number; name?: string; email?: string }
interface IAuthState {
  user: IUser | null;
  token: string | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  resetMessage?: string | null;
}

const initialState: IAuthState = {
  user: null,
  token: null,
  loading: "idle",
  error: null,
  resetMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => { state.error = null; },
    clearResetMessage: (state) => { state.resetMessage = null; }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(ActLogin.pending, (s) => { s.loading = "pending"; s.error = null; })
      .addCase(ActLogin.fulfilled, (s, a: PayloadAction<{ user: IUser; token: string }>) => {
        s.loading = "succeeded"; s.user = a.payload.user; s.token = a.payload.token;
      })
      .addCase(ActLogin.rejected, (s, a) => { s.loading = "failed"; s.error = (a.payload as string) || a.error.message || "Login failed"; })

      // Logout
      .addCase(ActLogout.fulfilled, (s) => { s.user = null; s.token = null; s.loading = "idle"; s.error = null; })

      // Send Reset Code
      .addCase(ActSendResetCode.pending, (s) => { s.loading = "pending"; s.error = null; s.resetMessage = null; })
      .addCase(ActSendResetCode.fulfilled, (s, a) => { s.loading = "succeeded"; s.resetMessage = a.payload?.message || "Code sent"; })
      .addCase(ActSendResetCode.rejected, (s, a) => { s.loading = "failed"; s.error = (a.payload as string) || a.error.message || "Failed to send code"; })

      // Verify Code
      .addCase(ActVerifyCode.pending, (s) => { s.loading = "pending"; s.error = null; })
      .addCase(ActVerifyCode.fulfilled, (s, a) => { s.loading = "succeeded"; s.resetMessage = a.payload?.message || "Code verified"; })
      .addCase(ActVerifyCode.rejected, (s, a) => { s.loading = "failed"; s.error = (a.payload as string) || a.error.message || "Verification failed"; })

      // Reset Password
      .addCase(ActResetPassword.pending, (s) => { s.loading = "pending"; s.error = null; })
      .addCase(ActResetPassword.fulfilled, (s, a) => { s.loading = "succeeded"; s.resetMessage = a.payload?.message || "Password reset succeeded"; })
      .addCase(ActResetPassword.rejected, (s, a) => { s.loading = "failed"; s.error = (a.payload as string) || a.error.message || "Reset failed"; });
  }
});

export const { clearAuthError, clearResetMessage } = authSlice.actions;
export default authSlice.reducer;






// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IAuthState, IUser } from "@/types/auth";
// import { ActLogin, ActLogout } from "./thunkActions/ActAuth";

// const initialState: IAuthState = {
//   user: null,
//   token: null,
//   loading: "idle",
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     clearAuthError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(ActLogin.pending, (state) => {
//         state.loading = "pending";
//         state.error = null;
//       })
//       .addCase(
//         ActLogin.fulfilled,
//         (state, action: PayloadAction<{ user: IUser; token: string }>) => {
//           state.loading = "succeeded";
//           state.user = action.payload.user;
//           state.token = action.payload.token;
//         }
//       )
//       .addCase(ActLogin.rejected, (state, action) => {
//         state.loading = "failed";
//         state.error = (action.payload as string) || "Login failed";
//       })
//       .addCase(ActLogout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         state.loading = "idle";
//       });
//   },
// });

// export const { clearAuthError } = authSlice.actions;
// export { ActLogin, ActLogout };
// export default authSlice.reducer;
