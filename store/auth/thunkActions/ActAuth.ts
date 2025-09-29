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
      const resp = await api.post("/dashboard-api/v1/auth/login", payload);

      const token = resp.data.data.access_token;

      // Set token in cookie and also in localStorage for redundancy
      Cookies.set("access_token", token, { expires: 7 });

      return { user: resp.data.data.user ?? null, token };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  }
);
// ---------------- LOGOUT ----------------
export const ActLogout = createAsyncThunk("auth/logout", async () => {
  Cookies.remove("access_token");
  return true;
});

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
      // Set token in cookie and also in localStorage for redundancy
      Cookies.set("access_token", token, { expires: 7 });


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

      const token = Cookies.get("access_token");
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
      const token = Cookies.get("access_token");
      const resp = await api.post("/dashboard-api/v1/auth/reset-password", resetPass,
        {
          headers: {
             Authorization: `Bearer ${token}`,
          }
        }
      );
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