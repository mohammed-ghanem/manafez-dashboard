/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { sanctumApi } from "@/services/api";

export const ActCreateRole = createAsyncThunk(
  "roles/create",
  async (body: any, { rejectWithValue }) => {
    try {
      await sanctumApi.get("/sanctum/csrf-cookie");

      const res = await api.post("/roles", {
        name: {
          ar: body.name_ar,
          en: body.name_en,
        },
        description: "",
        is_active: true,
        role_permissions: body.permissions,
      });

      return res.data.data.role;

    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Create failed");
    }
  }
);
