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
      is_active: Boolean(Number(user?.is_active ?? user?.isActive ?? 0)),
      created_at: user?.created_at ?? user?.createdAt,
      updated_at: user?.updated_at ?? user?.updatedAt,
      message: item?.message,
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