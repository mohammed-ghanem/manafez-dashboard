import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActDeleteRole = createAsyncThunk(
  "roles/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/roles/${id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



