
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "@/services/api";

// ---------------- FETCH PROFILE ----------------
export const ActFetchProfile = createAsyncThunk(
  "auth/fetchProfile", // ✅ Changed from "user/fetchProfile" to "auth/fetchProfile"
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const resp = await api.get("/dashboard-api/v1/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data?.data || resp.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch profile"
      );
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

      const resp = await api.post("/dashboard-api/v1/auth/update-profile", payload, {
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





// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";
// import api from "@/services/api";

// // ---------------- FETCH PROFILE ----------------
// export const ActFetchProfile = createAsyncThunk(
//   "user/fetchProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = Cookies.get("access_token");

//       if (!token) {
//         return rejectWithValue("No authentication token found");
//       }

//       const resp = await api.get("/dashboard-api/v1/auth/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return resp.data?.data || resp.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || err.message || "Failed to fetch profile"
//       );
//     }
//   }
// );

// // ---------------- UPDATE PROFILE ----------------
// interface UpdateProfilePayload {
//   name: string;
//   email: string;
//   phone?: string;
// }

// export const ActUpdateProfile = createAsyncThunk(
//   "user/updateProfile",
//   async (payload: UpdateProfilePayload, { rejectWithValue }) => {
//     try {
//       const token = Cookies.get("access_token");

//       if (!token) {
//         return rejectWithValue("No authentication token found");
//       }

//       const resp = await api.post("/dashboard-api/v1/auth/update-profile", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       return {
//         message: resp.data?.message || "Profile updated successfully",
//         user: resp.data?.data,
//       };
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to update profile"
//       );
//     }
//   }
// );
