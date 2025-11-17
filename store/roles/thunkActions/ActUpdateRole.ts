import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";



export const ActFetchRole = createAsyncThunk(
  "roles/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/roles/${id}`);
      return res.data.data.role;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);


export const ActUpdateRole = createAsyncThunk(
    "roles/update",
    async ({ id, body }: { id: number; body: any }, { rejectWithValue }) => {
      try {
        const res = await api.post(`/roles/${id}`, body);
        return res.data.data.role;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Update failed");
      }
    }
  );