// store/admins/thunkActions/ActUpdateAdmin.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActUpdateAdmin = createAsyncThunk(
  "admins/update",
  async (
    { id, data }: { id: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/admins/${id}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);
