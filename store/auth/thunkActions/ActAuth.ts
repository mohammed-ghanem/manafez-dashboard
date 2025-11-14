/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api, { sanctumApi } from "@/services/api"; // Import both instances

type LoginPayload = { email: string; password: string };
type SendResetPayload = { email: string };
type VerifyPayload = { email: string; code: string };
type ResetPayload = {
  email: string;
  code: string;
  password: string;
  password_confirmation?: string;
};
interface ChangePasswordPayload {
  old_password: string;
  password: string;
  password_confirmation: string;
}

// ---------------- LOGIN ----------------
export const ActLogin = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      // 1) First, ensure we have a fresh CSRF token using sanctumApi (root base URL)
      await sanctumApi.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      // 2) Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3) Send login request using api (already includes /dashboard-api/v1/)
      const resp = await api.post("/auth/login", payload); // Clean URL!

      const token = resp.data.data.access_token;
      Cookies.set("access_token", token, { expires: 7 });

      return { user: resp.data.data.user ?? null, token, message: resp.data.message };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  }
);

// ---------------- LOGOUT ----------------
export const ActLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");

      const res = await api.post("/auth/logout", {}, { // Clean URL!
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("✅ Logout response full:", res.data);
      Cookies.remove("access_token", { path: "/" });

      return {
        message: res.data?.message || res.data?.data?.message || res.data?.msg || "Logout successful",
      };
    } catch (err: any) {
      console.error("❌ Logout error:", err.response?.data);
      Cookies.remove("access_token", { path: "/" });
      return rejectWithValue(
        err.response?.data?.message || err.response?.data?.msg || "Logout failed"
      );
    }
  }
);

// ---------------- SEND RESET CODE -- forget password ----------------
export const ActSendResetCode = createAsyncThunk(
  "auth/sendResetCode",
  async (payload: SendResetPayload, { rejectWithValue }) => {
    try {
      // 1) CSRF token using sanctumApi
      await sanctumApi.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // 2) Send request using api
      const resp = await api.post("/auth/forget-password", { // Clean URL!
        email: payload.email 
      });

      const token = resp.data.data.access_token;
      Cookies.set("reset_token", token, { expires: 1 });

      return resp.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to send reset code"
      );
    }
  }
);

// ---------------- VERIFY CODE ----------------
export const ActVerifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (payload: VerifyPayload, { rejectWithValue }) => {
    try {
      await sanctumApi.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const verifyData = { code: payload.code };
      const token = Cookies.get("reset_token");
      
      const resp = await api.post("/auth/verify-otp", verifyData, { // Clean URL!
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return resp.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Code verification failed"
      );
    }
  }
);

// ---------------- RESET PASSWORD ----------------
export const ActResetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: ResetPayload, { rejectWithValue }) => {
    try {
      await sanctumApi.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const resetPass = {
        email: payload.email,
        code: payload.code,
        password: payload.password,
        password_confirmation: payload.password_confirmation ?? payload.password,
      };
      
      const resetToken = Cookies.get("reset_token");
      const resp = await api.post("/auth/reset-password", resetPass, { // Clean URL!
        headers: {
          Authorization: `Bearer ${resetToken}`,
        }
      });
      
      Cookies.remove("reset_token");
      return resp.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Reset password failed"
      );
    }
  }
);

// ---------------- CHANGE PASSWORD ----------------
export const ActChangePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const res = await api.post("/auth/change-password", payload, { // Clean URL!
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data?.access_token) {
        Cookies.set("access_token", res.data.data.access_token);
      }

      return {
        message: res.data?.message || "Password updated successfully",
      };
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0] as string[];
          return rejectWithValue(firstError?.[0] || "Validation failed");
        }
        if (err.response.data?.message) {
          return rejectWithValue(err.response.data.message);
        }
      }
      
      return rejectWithValue(
        err.response?.data?.message ||
        "Password update failed. Please check your current password."
      );
    }
  }
);