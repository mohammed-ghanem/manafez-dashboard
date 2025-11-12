import { createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "@/services/roleService";
import { Role } from "../types";

export const ActUpdateRole = createAsyncThunk<Role, { id: number; name: string }>(
  "roles/update",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const res = await roleService.updateRole(id, { name });
      return res.data.data || res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update role");
    }
  }
);
