/* eslint-disable @typescript-eslint/no-explicit-any */
//ActUser.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "@/services/api";

// ---------------- FETCH PROFILE ----------------

export const ActFetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Let the interceptor attach token from cookie at request time
      const resp = await api.get("/auth/profile", { withCredentials: true });
      const payload = resp.data?.data ?? resp.data;
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to fetch profile");
    }
  }
);


// ---------------- UPDATE PROFILE ----------------
interface UpdateProfilePayload {
  name: string;
  email: string;
  mobile?: string;
}

export const ActUpdateProfile = createAsyncThunk(
  "auth/updateProfile", // ✅ Changed from "user/updateProfile" to "auth/updateProfile"
  async (payload: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const resp = await api.post("/auth/update-profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        message: resp.data?.message || "Profile updated successfully",
        user: resp.data?.data,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile"
      );
    }
  }
);