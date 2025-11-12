import { createAsyncThunk } from "@reduxjs/toolkit";
import permissionService from "@/services/permissionService";
import { Permission } from "../types";

export const ActFetchPermissions = createAsyncThunk<Permission[]>(
  "permissions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await permissionService.getPermissions();
      return res.data.data || res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch permissions");
    }
  }
);
