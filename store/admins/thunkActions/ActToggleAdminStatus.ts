import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActToggleAdminStatus = createAsyncThunk<
  number,          // return admin id
  number,          // admin id input
  { rejectValue: string }
>(
  "admins/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      await api.post(`/admins/status/${id}`, {
        reason: "toggle from dashboard",
      });

      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);
