// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api";

// export const ActFetchPermissions = createAsyncThunk(
//   "permissions/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/permissions");

//       // Keep the structure as: [{ name, controls: [] }, ...]
//       const grouped = res.data.data.map((group: any) => ({
//         name: group.name,
//         controls: group.controls ?? []
//       }));

//       return grouped;
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message ?? err.message);
//     }
//   }
// );
 