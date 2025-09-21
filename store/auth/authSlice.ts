import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState, IUser } from "@/types/auth";
import { ActLogin, ActLogout } from "./thunkActions/ActAuth";

const initialState: IAuthState = {
  user: null,
  token: null,
  loading: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ActLogin.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(
        ActLogin.fulfilled,
        (state, action: PayloadAction<{ user: IUser; token: string }>) => {
          state.loading = "succeeded";
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(ActLogin.rejected, (state, action) => {
        state.loading = "failed";
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(ActLogout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = "idle";
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export { ActLogin, ActLogout };
export default authSlice.reducer;
