import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "./types";
import { ActFetchRoles } from "./thunkActions/ActFetchRoles";
import { ActCreateRole } from "./thunkActions/ActCreateRole";
import { ActUpdateRole } from "./thunkActions/ActUpdateRole";
import { ActDeleteRole } from "./thunkActions/ActDeleteRole";

interface RolesState {
  roles: Role[];
  selectedRole: Role | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  operationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  operationError: string | null;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  status: "idle",
  operationStatus: "idle",
  error: null,
  operationError: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.operationError = null;
    },
    clearOperationStatus: (state) => {
      state.operationStatus = "idle";
      state.operationError = null;
    },
    setSelectedRole: (state, action: PayloadAction<Role | null>) => {
      state.selectedRole = action.payload;
    },
    resetOperationState: (state) => {
      state.operationStatus = "idle";
      state.operationError = null;
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Roles
    builder
      .addCase(ActFetchRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(ActFetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(ActFetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch roles";
      });

    // Create Role
    builder
      .addCase(ActCreateRole.pending, (state) => {
        state.operationStatus = "loading";
        state.operationError = null;
      })
      .addCase(ActCreateRole.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        state.roles.unshift(action.payload); // better UX
        state.operationError = null;
      })
      .addCase(ActCreateRole.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError  = (action.payload as string) || action.error?.message || "Failed to create role";
      });

    // Update Role
    builder
      .addCase(ActUpdateRole.pending, (state) => {
        state.operationStatus = "loading";
        state.operationError = null;
      })
      .addCase(ActUpdateRole.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.selectedRole = null;
        state.operationError = null;
      })
      .addCase(ActUpdateRole.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload || "Failed to update role";
      });

    // Delete Role
    builder
      .addCase(ActDeleteRole.pending, (state) => {
        state.operationStatus = "loading";
        state.operationError = null;
      })
      .addCase(ActDeleteRole.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        state.roles = state.roles.filter(role => role.id !== action.payload);
        state.operationError = null;
      })
      .addCase(ActDeleteRole.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload || "Failed to delete role";
      });
  },
});

export const { 
  clearError, 
  clearOperationStatus, 
  setSelectedRole, 
  resetOperationState 
} = rolesSlice.actions;

export default rolesSlice.reducer;