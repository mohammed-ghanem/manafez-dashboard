// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk } from "@reduxjs/toolkit"
// import Cookies from "js-cookie"
// import api from "@/services/api"
// import axios from "axios";


// type LoginPayload = { email: string; password: string }
// type SendResetPayload = { email: string }
// type VerifyPayload = { email: string; code: string }
// type ResetPayload = {
//   email: string
//   code: string
//   password: string
//   password_confirmation?: string
// }

// export const ActLogin = createAsyncThunk("auth/login", async (payload: LoginPayload,

//   { rejectWithValue }) => {
//   try {
//     // 1) Ensure we have a fresh CSRF cookie
//     // Step 1: Get CSRF cookie (sets XSRF-TOKEN + session)
//       axios.defaults.withCredentials = true;

//     await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//       withCredentials: true
//     });  

//     // await api.get("/sanctum/csrf-cookie" , { withCredentials: true });

//     // 3) Send login request
//     const resp = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/login`,
//       payload, 
//       {
//         withCredentials: true,
//         headers: {
//           "api-key": process.env.NEXT_PUBLIC_API_KEY,
//         },
//       }
//     )



//     console.log("Login response:", resp.data.data)

//     // 4) Save token
//     const token = resp.data.data.access_token
//     Cookies.set("access_token", token, {
//       expires: 7,
//     })

//     return { user: resp.data.data.user ?? null, token }
//   } catch (err: any) {
//     console.error("Login error:", err.response?.data || err.message)
//     return rejectWithValue(err.response?.data?.message || err.message || "Login failed")
//   }
// })

// export const ActLogout = createAsyncThunk("auth/logout", async () => {
//   try {
//     // Try to call logout endpoint if available
//     await api.post("/dashboard-api/v1/auth/logout")
//   } catch (error) {
//     console.warn("Logout endpoint failed:", error)
//   } finally {
//     // Always remove local token
//     Cookies.remove("access_token")
//   }
//   return true
// })

// export const ActSendResetCode = createAsyncThunk(
//   "auth/sendResetCode",
//   async (payload: SendResetPayload, { rejectWithValue }) => {
//     try {
//       const resp = await api.post("/dashboard-api/v1/auth/forgot-password", payload)
//       return resp.data
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || err.message || "Failed to send reset code")
//     }
//   },
// )

// export const ActVerifyCode = createAsyncThunk(
//   "auth/verifyCode",
//   async (payload: VerifyPayload, { rejectWithValue }) => {
//     try {
//       const resp = await api.post("/dashboard-api/v1/auth/verify-code", payload)
//       return resp.data
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || err.message || "Code verification failed")
//     }
//   },
// )

// export const ActResetPassword = createAsyncThunk(
//   "auth/resetPassword",
//   async (payload: ResetPayload, { rejectWithValue }) => {
//     try {
//       const body = {
//         email: payload.email,
//         code: payload.code,
//         password: payload.password,
//         password_confirmation: payload.password_confirmation ?? payload.password,
//       }

//       const resp = await api.post("/dashboard-api/v1/auth/reset-password", body)
//       return resp.data
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || err.message || "Reset password failed")
//     }
//   },
// )






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

// ---------------- SEND RESET CODE ----------------
export const ActSendResetCode = createAsyncThunk(
  "auth/sendResetCode",
  async (payload: SendResetPayload, { rejectWithValue }) => {
    try {
      const resp = await api.post(
        "/dashboard-api/v1/auth/forgot-password",
        payload
      );
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
      const resp = await api.post("/dashboard-api/v1/auth/verify-code", payload);
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
      const body = {
        email: payload.email,
        code: payload.code,
        password: payload.password,
        password_confirmation:
          payload.password_confirmation ?? payload.password,
      };

      const resp = await api.post("/dashboard-api/v1/auth/reset-password", body);
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