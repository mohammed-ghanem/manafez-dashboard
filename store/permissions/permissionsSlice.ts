import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PermissionState, Permission } from "./types";
import { ActFetchPermissions } from "./thunkActions";

const initialState: PermissionState = {
  record: [],     
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
          state.record = action.payload;  
        }
      )
      .addCase(ActFetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default permissionsSlice.reducer;
