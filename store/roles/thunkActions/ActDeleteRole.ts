import { createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "@/services/roleService";

export const ActDeleteRole = createAsyncThunk<number, number>(
  "roles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete role");
    }
  }
);
