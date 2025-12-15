import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { UpdateRolePayload } from "../types";



export const ActUpdateRole = createAsyncThunk(
  "roles/update",
  async ({ id, body }: UpdateRolePayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Laravel fields
      formData.append("_method", "put");
      formData.append("name", body.name);
      formData.append("name[en]", body.name_en);
      formData.append("name[ar]", body.name_ar);

      body.permissions.forEach((p) =>
        formData.append("role_permissions[]", String(p))
      );

      const res = await api.post(`/roles/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

