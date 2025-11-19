import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Toggle active status
export const ActToggleRoleStatus = createAsyncThunk(
    "roles/toggleStatus",
    async ({ id, is_active }: { id: number; is_active: boolean }, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        
        formData.append("is_active", is_active ? "1" : "0");
  
        const res = await api.post(`/roles/toggle-role/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        return res.data.data.data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  