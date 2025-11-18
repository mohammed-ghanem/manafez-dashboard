import { createSlice } from "@reduxjs/toolkit";
import { ActFetchRoleById } from "./thunkActions/ActFetchRoleById";
import { ActUpdateRole } from "./thunkActions/ActUpdateRole";
import { ActFetchRoles } from "./thunkActions/ActFetchRoles";
import { ActFetchPermissions } from "../permissions/thunkActions";
import { RolesState, Role } from "./types";
import { ActToggleRoleStatus } from "./thunkActions/ActToggleRoleStatus";

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  status: "idle",
  operationStatus: "idle",
  error: null,
  operationError: null,
  loading: false,
  singleLoading: false,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(ActFetchRoles.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(ActFetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.roles = action.payload as Role[];
      })
      .addCase(ActFetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch one
      .addCase(ActFetchRoleById.pending, (state) => {
        state.singleLoading = true;
      })
      .addCase(ActFetchRoleById.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.selectedRole = action.payload as Role;
      })
      .addCase(ActFetchRoleById.rejected, (state, action) => {
        state.singleLoading = false;
        state.error = action.payload as string;
      })

      // Update role
      .addCase(ActUpdateRole.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(ActUpdateRole.fulfilled, (state) => {
        state.operationStatus = "success";
      })
      .addCase(ActUpdateRole.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload as string;
      })

      // Fetch permissions
      .addCase(ActFetchPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ActFetchPermissions.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(ActFetchPermissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
      // Toggle status
      builder.addCase(ActToggleRoleStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.roles.findIndex((r) => r.id === updated.id);
        if (index !== -1) state.roles[index] = updated;
      });
      
  },
});

export default rolesSlice.reducer;




