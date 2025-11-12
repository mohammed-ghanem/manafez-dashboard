// src/store/roles/thunkActions/ActCreateRole.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "@/services/roleService";
import { Role } from "../types";

interface CreateRoleData {
  name: string;
  description?: string;
}

export const ActCreateRole = createAsyncThunk<
  Role, 
  CreateRoleData, 
  { rejectValue: string }
>(
  "roles/create",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(roleData);
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.message 
        || "Failed to create role";
      return rejectWithValue(errorMessage);
    }
  }
);