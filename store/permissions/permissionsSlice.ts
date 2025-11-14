import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionState, Permission } from "./types";
import { ActFetchPermissions } from "./thunkActions";

const initialState: PermissionState = {
  permissions: [],
  loading: false,
  error: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ActFetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        ActFetchPermissions.fulfilled,
        (state, action: PayloadAction<Permission[]>) => {
          state.loading = false;
          state.permissions = action.payload;
        }
      )
      .addCase(ActFetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default permissionsSlice.reducer;
