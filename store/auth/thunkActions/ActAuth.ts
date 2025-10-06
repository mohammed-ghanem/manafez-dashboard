/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "@/services/api";

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
      // 1) First, ensure we have a fresh CSRF token
      await api.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      // 2) Small delay to ensure cookie is set (optional but sometimes helpful)
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3) Send login request
      const resp = await api.post("/dashboard-api/v1/auth/login", payload,);

      const token = resp.data.data.access_token;

      // Set token in cookie and also in localStorage for redundancy
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

      const res = await api.post(
        "/dashboard-api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      // 👇 Debug the exact backend response
      console.log("✅ Logout response full:", res.data);

      Cookies.remove("access_token", { path: "/" });

      return {
        message:
          res.data?.message || // case 1
          res.data?.data?.message || // case 2
          res.data?.msg || // case 3 (some APIs use `msg`)
          JSON.stringify(res.data), // fallback to print whole response
      };
    } catch (err: any) {
      console.error("❌ Logout error:", err.response?.data);

      Cookies.remove("access_token", { path: "/" });

      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Logout failed"
      );
    }
  }
);

// ---------------- SEND RESET CODE -- forget password ----------------
export const ActSendResetCode = createAsyncThunk(
  "auth/sendResetCode",
  async (payload: SendResetPayload, { rejectWithValue }) => {
    try {
      // 1) First, ensure we have a fresh CSRF token
      await api.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      // 2) Small delay to ensure cookie is set (optional but sometimes helpful)
      await new Promise(resolve => setTimeout(resolve, 10));

      // 3) Send login request
      const resp = await api.post(
        "/dashboard-api/v1/auth/forget-password",
        { email: payload.email }
      );

      const token = resp.data.data.access_token;
      Cookies.set("reset_token", token, { expires: 1 }); // short expiry (1 day for example)

      return resp.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset code"
      );
    }
  }
);

// ---------------- VERIFY CODE ----------------

export const ActVerifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (payload: VerifyPayload, { rejectWithValue }) => {
    try {
      // 1) First, ensure we have a fresh CSRF token
      await api.get("/sanctum/csrf-cookie", {
        withCredentials: true
      })

      // 2) Small delay to ensure cookie is set (optional but sometimes helpful)
      await new Promise(resolve => setTimeout(resolve, 100));

      const verifyData = {
        code: payload.code,
      };

      const token = Cookies.get("reset_token");
      const resp = await api.post("/dashboard-api/v1/auth/verify-otp", verifyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

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
      // 1) First, ensure we have a fresh CSRF token
      await api.get("/sanctum/csrf-cookie", {
        withCredentials: true
      });

      // 2) Small delay to ensure cookie is set (optional but sometimes helpful)
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3) Send login request
      const resetPass = {
        email: payload.email,
        code: payload.code,
        password: payload.password,
        password_confirmation:
          payload.password_confirmation ?? payload.password,
      };
      const resetToken = Cookies.get("reset_token");
      const resp = await api.post("/dashboard-api/v1/auth/reset-password", resetPass,
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          }
        }
      );
      // after success → clear reset_token, set access_token
      Cookies.remove("reset_token");

      return resp.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.message ||
        "Reset password failed"
      );
    }
  }
);

/// ---------------- CHANGE PASSWORD ----------------
export const ActChangePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const res = await api.post(
        "/dashboard-api/v1/auth/change-password",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If new access_token is returned, update it
      if (res.data?.data?.access_token) {
        Cookies.set("access_token", res.data.data.access_token);
      }

      return {
        message: res.data?.message || "Password updated successfully",
      };
    } catch (err: any) {
      // Clean error handling for production
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;
        if (errors) {
          // Return the first error message
          const firstError = Object.values(errors)[0] as string[];
          return rejectWithValue(firstError?.[0] || "Validation failed");
        }
        
        // Also check if there's a direct message
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