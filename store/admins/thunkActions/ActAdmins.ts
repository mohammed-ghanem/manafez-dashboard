/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { IAdmin } from "@/types/admins";


function normalizeItem(item: any): IAdmin {
    const user = item?.user ?? item;
    return {
      id: Number(user?.id) || 0,
      name: user?.name ?? "",
      email: user?.email ?? "",
      image: user?.image ?? null,
      mobile: user?.mobile ?? "",
      roles: user?.roles ?? user?.type ?? "",
      // backend returns 1/0 for is_active — convert to boolean
      is_active: Boolean(Number(user?.is_active ?? user?.isActive ?? 0)),
      created_at: user?.created_at ?? user?.createdAt,
      updated_at: user?.updated_at ?? user?.updatedAt,
    };
  }


export const ActFetchAdmins = createAsyncThunk<IAdmin[]>(
  "admins/fetch",
  async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/admins");
  
        // safe access to array in many nesting possibilities
        const raw = response?.data?.data;
        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(response?.data)
          ? response.data
          : [];
  
        const list: IAdmin[] = arr.map(normalizeItem);
        return list;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.message ?? "Failed to fetch admins";
        return rejectWithValue(msg);
      }
     
  }
);

export const ActDeleteAdmin = createAsyncThunk<number, number>(
  "admins/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admins/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? err.message);
    }
  }
);

export const ActToggleAdminStatus = createAsyncThunk<IAdmin, { id: number; is_active: boolean }>(
  "admins/toggle",
  async ({ id, is_active }, { rejectWithValue }) => {
    try {
      // adapt endpoint — could be PATCH /admins/:id or a custom route
      const res = await api.patch(`/admins/${id}/toggle`, { is_active });
      return res.data?.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? err.message);
    }
  }
);











// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api";

// export const ActFetchAdmins = createAsyncThunk(
//   "admins/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/admins");

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
