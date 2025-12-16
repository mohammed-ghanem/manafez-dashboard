// store/admins/thunkActions/ActDeleteAdmin.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActDeleteAdmin = createAsyncThunk(
  "admins/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/admins/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);
