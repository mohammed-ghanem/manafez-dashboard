import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import Cookies from "js-cookie";

interface LoginPayload {
  email: string;
  password: string;
}

export const ActLogin = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      await api.get("/sanctum/csrf-cookie");

      const response = await api.post("/dashboard-api/v1/auth/login", payload);
      const token = response.data.data.access_token;

      Cookies.set("access_token", token, { expires: 7 });

      return { user: response.data.data.user, token };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const ActLogout = createAsyncThunk("auth/logout", async () => {
  Cookies.remove("access_token");
  return true;
});
