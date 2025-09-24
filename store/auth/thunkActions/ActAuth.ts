/* eslint-disable @typescript-eslint/no-explicit-any */
/* store/auth/thunkActions/ActAuth.ts */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

type LoginPayload = { email: string; password: string };
type SendResetPayload = { email: string };
type VerifyPayload = { email: string; code: string };
type ResetPayload = { email: string; code: string; password: string; password_confirmation?: string };

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";



const buildHeaders = () => {
  // const csrfToken = Cookies.get("XSRF-TOKEN"); // set by Laravel
  const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  return {
    "X-XSRF-TOKEN": csrfToken ? decodeURIComponent(csrfToken) : "",
    apikey: API_KEY,
  };
};


export const ActLogin = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      // Step 1: Get CSRF cookie
      await axios.get(`${BASE}/sanctum/csrf-cookie`, { withCredentials: true });
      // Step 2: Send login request with headers + cookies
      const resp = await axios.post(`${BASE}/dashboard-api/v1/auth/login`, payload,
        {
          withCredentials: true,
          headers: buildHeaders(),
        })
      // Step 3: Store token;
      const token = resp.data.data.access_token;
      Cookies.set("access_token", token, { expires: 7 });
      return { user: resp.data.data.user ?? null, token };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "Login failed");
    }
  }
);

export const ActLogout = createAsyncThunk("auth/logout", async () => {
  Cookies.remove("access_token");
  return true;
});

export const ActSendResetCode = createAsyncThunk(
  "auth/sendResetCode",
  async (payload: SendResetPayload, { rejectWithValue }) => {
    try {
      // Adjust endpoint if backend differs
      const resp = await axios.post(`${BASE}/dashboard-api/v1/auth/forgot-password`, payload,
        {
          withCredentials: true,
          headers: buildHeaders(),
        })
      return resp.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to send reset code");
    }
  }
);

export const ActVerifyCode = createAsyncThunk(
  "auth/verifyCode",
  async (payload: VerifyPayload, { rejectWithValue }) => {
    try {
      const resp = await axios.post(`${BASE}/dashboard-api/v1/auth/verify-code`, payload,
        {
          withCredentials: true,
          headers: buildHeaders(),
        })
      return resp.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "Code verification failed");
    }
  }
);

export const ActResetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: ResetPayload, { rejectWithValue }) => {
    try {
      const body = {
        email: payload.email,
        code: payload.code,
        password: payload.password,
        password_confirmation: payload.password_confirmation ?? payload.password,
      };
      const resp = await axios.post(`${BASE}/dashboard-api/v1/auth/reset-password`, body,
        {
          withCredentials: true,
          headers: buildHeaders(),
        })
      return resp.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "Reset password failed");
    }
  }
);




// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api";
// import Cookies from "js-cookie";

// interface LoginPayload {
//   email: string;
//   password: string;
// }

// export const ActLogin = createAsyncThunk(
//   "auth/login",
//   async (payload: LoginPayload, { rejectWithValue }) => {
//     try {
//       await api.get("/sanctum/csrf-cookie");

//       const response = await api.post("/dashboard-api/v1/auth/login", payload);
//       const token = response.data.data.access_token;

//       Cookies.set("access_token", token, { expires: 7 });

//       return { user: response.data.data.user, token };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// export const ActLogout = createAsyncThunk("auth/logout", async () => {
//   Cookies.remove("access_token");
//   return true;
// });
