/* eslint-disable @typescript-eslint/no-explicit-any */
// store/permissions/thunkActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActFetchPermissions = createAsyncThunk(
  "permissions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/permissions");
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? err.message);
    }
  }
);
