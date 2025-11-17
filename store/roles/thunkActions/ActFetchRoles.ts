import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";


export const ActFetchRoles = createAsyncThunk(
  "roles/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/roles");
      return res.data.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);