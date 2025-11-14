/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/roles/thunkActions/ActUpdateRole.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "@/services/roleService";
import { Role } from "../types";
import { RootState } from "@/store/store";

interface UpdateRolePayload {
  id: number;
  data: {
    name?: string;
    name_ar?: string;
    name_en?: string;
    description?: string;
    permissions?: string[];
  };
}

export const ActUpdateRole = createAsyncThunk<
  Role,
  UpdateRolePayload,
  { 
    rejectValue: string;
    state: RootState;
  }
>(
  "roles/update",
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("Authentication required");

      const response = await roleService.updateRole(id, data);
      
      // Handle different API response structures
      const updatedRole = response.data?.data || response.data;
      
      if (!updatedRole) {
        throw new Error("Invalid response format from server");
      }

      return updatedRole;

    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const getErrorMessage = (error: any): string => {
  if (error.response?.status === 422) {
    const errors = error.response.data?.errors;
    if (errors) {
      const firstError = Object.values(errors)[0] as string[];
      return firstError?.[0] || "Validation failed";
    }
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Failed to update role"
  );
};