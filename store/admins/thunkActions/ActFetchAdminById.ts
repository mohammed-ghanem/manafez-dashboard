// store/admins/thunkActions/ActFetchAdminById.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { IAdmin } from "@/types/admins";

export const ActFetchAdminById = createAsyncThunk<
  IAdmin,
  number,
  { rejectValue: string }
>("admins/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/admins/${id}`);
    const user = res.data?.data?.Admin?.user;

    if (!user) {
      return rejectWithValue("Invalid admin data");
    }

    return {
      id: Number(user.id),
      name: user.name ?? "",
      email: user.email ?? "",
      mobile: user.mobile ?? "",
      image: user.image ?? null,
      is_active: Boolean(Number(user.is_active)),
      roles: user.roles ?? "",
      roles_ids: user.roles_ids
        ? Object.values(user.roles_ids).map((r: any) => Number(r.id))
        : [], // ✅ ALWAYS number[]
    };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Fetch admin failed"
    );
  }
});