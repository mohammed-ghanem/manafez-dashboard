/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const ActCreateRole = createAsyncThunk(
  "roles",
  async (body: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/roles", body);
      return res.data.data.role;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);




// /* eslint-disable @typescript-eslint/no-explicit-any */
// // store/roles/thunkActions.ts
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api"; // your axios instance

// type CreateRolePayload = {
//   name: string;
//   permissions: number[]; // or string[] depending on backend
// };

// export const ActCreateRole = createAsyncThunk(
//   "roles/create",
//   async (payload: CreateRolePayload, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/roles", payload);
//       // adjust if response shape differs
//       return res.data.data ?? res.data;
//     } catch (err: any) {
//       // return backend message if available
//       return rejectWithValue(err?.response?.data?.message ?? err.message);
//     }
//   }
// );
