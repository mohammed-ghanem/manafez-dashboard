import { createSlice } from "@reduxjs/toolkit";
import { Permission } from "./types";
import { ActFetchPermissions } from "./thunkActions/ActFetchPermissions";

type PermissionState = {
  permissions: Permission[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: PermissionState = {
  permissions: [],
  status: "idle",
  error: null,
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ActFetchPermissions.pending, (s) => {
        s.status = "loading";
      })
      .addCase(ActFetchPermissions.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.permissions = a.payload;
      })
      .addCase(ActFetchPermissions.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload as string;
      });
  },
});

export default permissionSlice.reducer;
