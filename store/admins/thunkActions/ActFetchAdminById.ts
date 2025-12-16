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
    const admin = res.data?.data?.Admin;

    if (!admin?.user) {
      return rejectWithValue("Invalid admin data");
    }

    return {
      id: Number(admin.user.id),
      name: admin.user.name ?? "",
      email: admin.user.email ?? "",
      mobile: admin.user.mobile ?? "",
      image: admin.user.image ?? null,
      is_active: Boolean(Number(admin.user.is_active)),
      roles_ids: admin.user.roles_ids ?? [], // 👈 correct path
    };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Fetch admin failed"
    );
  }
});






// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api";
// import { IAdmin } from "@/types/admins";

// export const ActFetchAdminById = createAsyncThunk<IAdmin, number>(
//   "admins/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/admins/${id}`);
//       const admin = res.data?.data?.Admin;

//       if (!admin?.user) {
//         throw new Error("Invalid admin data");
//       }

//       return {
//         id: Number(admin.user.id),
//         name: admin.user.name ?? "",
//         email: admin.user.email ?? "",
//         mobile: admin.user.mobile ?? "",
//         image: admin.user.image ?? null,
//         is_active: Boolean(Number(admin.user.is_active)),
//         roles_ids: admin.roles_ids ?? [],
//       };
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Fetch admin failed");
//     }
//   }
// );