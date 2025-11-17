// src/store/roles/ActFetchRoleById.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActFetchRoleById = createAsyncThunk(
  "roles/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/roles/${id}`);
      return res.data.data.role; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch role");
    }
  }
);
