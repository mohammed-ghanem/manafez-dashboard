import { createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "@/services/roleService";
import { Role } from "../types";

export const ActAssignPermissions = createAsyncThunk<
  Role,
  { id: number; permissions: string[] }
>(
  "roles/assignPermissions",
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const res = await roleService.assignPermissions(id, permissions);
      return res.data.data || res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to assign permissions");
    }
  }
);
