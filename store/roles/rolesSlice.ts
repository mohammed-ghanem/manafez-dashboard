// src/store/roles/rolesSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { RoleState } from "./types";
import * as thunkActions from "./thunkActions";

const initialState: RoleState = {
  roles: [],
  status: "idle",
  error: null,
  currentRole: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(thunkActions.ActFetchRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(thunkActions.ActFetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(thunkActions.ActFetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create Role
      .addCase(thunkActions.ActCreateRole.pending, (state) => {
        state.error = null;
      })
      .addCase(thunkActions.ActCreateRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
        state.error = null;
      })
      .addCase(thunkActions.ActCreateRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update Role
      .addCase(thunkActions.ActUpdateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(thunkActions.ActUpdateRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete Role
      .addCase(thunkActions.ActDeleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        state.error = null;
      })
      .addCase(thunkActions.ActDeleteRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Assign Permissions
      .addCase(thunkActions.ActAssignPermissions.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(thunkActions.ActAssignPermissions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentRole, clearCurrentRole } = roleSlice.actions;
export default roleSlice.reducer;