import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../base/axiosBaseQuery";
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
      message: item?.message ?? "",
    };
  }

export const adminsApi = createApi({
  reducerPath: "adminsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Admins"],
  endpoints: (builder) => ({
    // ✅ GET ADMINS
    getAdmins: builder.query<IAdmin[], void>({
        query: () => ({
          url: "/admins",
          method: "get",
        }),
        transformResponse: (response: any) => {
          const raw =
            response?.data?.data ??
            response?.data ??
            response?.admins ??
            [];
      
          return Array.isArray(raw) ? raw.map(normalizeItem) : [];
        },
        providesTags: ["Admins"],
      }),
      

    // ✅ DELETE ADMIN
    deleteAdmin: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admins/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Admins"],
    }),

    // ✅ TOGGLE STATUS
    toggleAdminStatus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admins/status/${id}`,
        method: "post",
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
} = adminsApi;
