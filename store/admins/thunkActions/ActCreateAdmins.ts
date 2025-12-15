import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { ICreateAdminPayload } from "@/types/admins";


export const ActCreateAdmin = createAsyncThunk(
  "admins/create",
  async (data: ICreateAdminPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("password", data.password);
      formData.append("password_confirmation", data.password_confirmation);
      formData.append("is_active", data.is_active ? "1" : "0");

      data.role_id.forEach((id) => {
        formData.append("role_id[]", String(id));
      });

      const res = await api.post("/admins", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);





// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api";
// import { IAdmin, ICreateAdminPayload } from "@/types/admins";

// function normalizeItem(item: any): IAdmin {
//   const user = item?.user ?? item;
//   return {
//     id: Number(user?.id) || 0,
//     name: user?.name ?? "",
//     email: user?.email ?? "",
//     image: user?.image ?? null,
//     mobile: user?.mobile ?? "",
//     roles: user?.roles ?? user?.type ?? "",
//     is_active: Boolean(Number(user?.is_active ?? user?.isActive ?? 0)),
//     created_at: user?.created_at ?? user?.createdAt,
//     updated_at: user?.updated_at ?? user?.updatedAt,
//   };
// }

// export const ActCreateAdmin = createAsyncThunk<
//   IAdmin,
//   ICreateAdminPayload
// >(
//   "admins/create",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/admins", data);
//       const admin = res?.data?.data ?? res.data;
//       return normalizeItem(admin);
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message ?? err.message ?? "Failed to create admin"
//       );
//     }
//   }
// );
