/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/roles/thunkActions/ActDeleteRole.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "@/services/roleService";
import { RootState } from "@/store/store";

export const ActDeleteRole = createAsyncThunk<
  number, // Return the deleted role ID
  number, // roleId
  { 
    rejectValue: string;
    state: RootState;
  }
>(
  "roles/delete",
  async (roleId, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue("Authentication required");

      await roleService.deleteRole(roleId);
      
      return roleId;

    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const getErrorMessage = (error: any): string => {
  if (error.response?.status === 404) {
    return "Role not found";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Failed to delete role"
  );
};