/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";

import {
  useGetAdminsQuery,
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
} from "@/store/admins/adminsApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useSessionReady } from "@/hooks/useSessionReady";

import { Edit3, Trash2 } from "lucide-react";
import { Column, DataTable } from "../datatable/DataTable";
import { TABLE_HEADERS } from "@/constants/tableHeaders";
import TranslateHook from "@/translate/TranslateHook";

type Admin = {
  id: number;
  name: string;
  email: string;
  roles: any;
  is_active: boolean;
};

export default function Admins() {
  const sessionReady = useSessionReady();
  const lang = LangUseParams() as "ar" | "en";
  const translate = TranslateHook();

  const headers = TABLE_HEADERS[lang].admins;

  const {
    data: admins = [],
    isLoading,
    isError,
  } = useGetAdminsQuery(undefined, {
    skip: !sessionReady,
  });
  const [deleteAdmin] = useDeleteAdminMutation();
  const [toggleStatus] = useToggleAdminStatusMutation();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ========================
     Helpers
  ======================== */
  const isProtectedAdmin = (roles: any) => {
    if (Array.isArray(roles)) {
      return roles.some(
        (r) =>
          r === "admin" ||
          r === "أدمن" ||
          r === "ادمن" ||
          r?.name === "admin" ||
          r?.name === "أدمن" ||
          r?.name === "ادمن",
      );
    }
    return roles === "admin" || roles === "أدمن" || roles === "ادمن";
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteAdmin(deleteId).unwrap();
      toast.success(res?.message);
    } catch (err: any) {
      const errorData = err?.data ?? err;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
        return;
      }
      if (errorData?.message) {
        toast.error(errorData.message);
        return;
      }
    }
  };

  const handleToggleStatus = async (admin: Admin) => {
    if (isProtectedAdmin(admin.roles)) return;
    await toggleStatus(admin.id).unwrap();
  };

  /* ========================
     Columns
  ======================== */
  const columns: Column<Admin>[] = [
    {
      key: "name",
      header: headers.name,
      render: (_, admin) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{admin.name}</span>
          {isProtectedAdmin(admin.roles) && (
            <Badge variant="secondary">
              {lang === "ar" ? "محمي" : "Protected"}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "email",
      header: headers.email,
    },
    {
      key: "roles",
      header: headers.roles,
      render: (roles) =>
        Array.isArray(roles) ? roles.map((r) => r.name ?? r).join(", ") : roles,
    },
    {
      key: "is_active",
      header: headers.status,
      align: "center",
      render: (_, admin) =>
        !isProtectedAdmin(admin.roles) ? (
          <div className="flex items-center justify-center gap-2" dir="ltr">
            <Switch
              checked={admin.is_active}
              className="data-[state=checked]:bg-green-600"
              onCheckedChange={() => handleToggleStatus(admin)}
            />
            <span className="text-sm">
              {admin.is_active
                ? lang === "ar"
                  ? "مفعل"
                  : "Active"
                : lang === "ar"
                  ? "غير مفعل"
                  : "Inactive"}
            </span>
          </div>
        ) : null,
    },
    {
      key: "id",
      header: headers.actions,
      align: "center",
      render: (_, admin) =>
        !isProtectedAdmin(admin.roles) && (
          <div className="flex justify-center gap-2">
            {/* EDIT */}
            <Link href={`/${lang}/admins/edit/${admin.id}`}>
              <Button size="sm">
                <Edit3 className="h-4 w-4" />
              </Button>
            </Link>

            {/* DELETE */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteId(admin.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {lang === "ar"
                      ? "هل أنت متأكد من حذف هذا المسؤول؟"
                      : "Are you sure you want to delete this admin?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600"
                    onClick={handleDelete}
                  >
                    {lang === "ar" ? "حذف" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
    },
  ];

  const showSkeleton = !sessionReady || isLoading;

  if (isError) return <div>Error</div>;

  return (
    <div className="p-6 mx-4 my-10 bg-white rounded-2xl border space-y-6">
      <div>
        <Link
          href={`/${lang}/admins/create`}
          className={`createBtn mb-4 ${showSkeleton ? "block w-40 h-9 py-2.5 opacity-50" : ""}`}
        >
          {!showSkeleton &&
            `${translate?.pages.admins.createAdmin.title || ""}`}
        </Link>
      </div>

      <DataTable
        data={admins}
        columns={columns}
        isSkeleton={showSkeleton}
        searchPlaceholder={`${translate?.pages.admins.searchPlaceholder || ""}`}
      />
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   useGetAdminsQuery,
//   useDeleteAdminMutation,
//   useToggleAdminStatusMutation,
// } from "@/store/admins/adminsApi";

// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";

// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// import Link from "next/link";
// import { useState } from "react";
// import LangUseParams from "@/translate/LangUseParams";
// import { Edit3, Trash2 } from "lucide-react";

// const Admins = () => {
//   const lang = LangUseParams();
//   const { data: admins = [], isLoading } = useGetAdminsQuery();
//   const [deleteAdmin] = useDeleteAdminMutation();
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//    const [toggleStatus] = useToggleAdminStatusMutation();
//    const [togglingId, setTogglingId] = useState<number | null>(null);

//   const isProtectedAdmin = (roles: any) => {
//     if (Array.isArray(roles)) {
//       return roles.some(
//         (r) =>
//           r === "admin" ||
//           r === "أدمن" ||
//           r === "ادمن" ||
//           r?.name === "admin" ||
//           r?.name === "أدمن" ||
//           r?.name === "ادمن"
//       );
//     }

//     return roles === "admin" || roles === "أدمن" || roles === "ادمن";
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;

//     try {

//       const res = await deleteAdmin(deleteId).unwrap();

//       toast.success(
//         <span className="font-cairo font-bold">
//           {res?.message || "تم حذف المسؤول بنجاح"}
//         </span>
//       );
//     } catch (err: any) {
//       console.error("Delete error:", err);

//       if (err?.errors) {
//         Object.values(err.errors).forEach((value: any) => {
//           if (Array.isArray(value)) {
//             value.forEach((msg) => toast.error(msg));
//           } else {
//             toast.error(value);
//           }
//         });
//       } else if (err?.message) {
//         toast.error(err.message);
//       } else {
//         toast.error("حدث خطأ أثناء الحذف");
//       }
//     } finally {
//       setDeleteId(null);
//     }
//   };

//   const handleToggleStatus = async (id: number) => {
//     setTogglingId(id);
//      await toggleStatus(id).unwrap();
//     setTogglingId(null);
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (

//     <div className="p-6 mx-4 my-10 bg-white rounded-2xl border border-[#ddd] space-y-6">
//   <div>
//     <Link
//       href={`/${lang}/admins/create`}
//       className="createBtn"
//     >
//       انشاء مسؤول جديد
//     </Link>
//   </div>

//   <div className="overflow-x-auto">
//     <table className="w-full border-collapse">
//       {/* ===== TABLE HEADER ===== */}
//       <thead>
//         <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
//           <th className="p-3 border">Name</th>
//           <th className="p-3 border">Email</th>
//           <th className="p-3 border">Roles</th>
//           <th className="p-3 border">Status</th>
//           <th className="p-3 border text-center">Actions</th>
//         </tr>
//       </thead>

//       {/* ===== TABLE BODY ===== */}
//       <tbody>
//         {admins.map((admin) => {
//           const protectedAdmin = isProtectedAdmin(admin.roles);

//           return (
//             <tr
//               key={admin.id}
//               className="hover:bg-gray-50 transition"
//             >
//               {/* NAME */}
//               <td className="p-3 border">
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">{admin.name}</span>
//                   {protectedAdmin && (
//                     <Badge variant="secondary">محمي</Badge>
//                   )}
//                 </div>
//               </td>

//               {/* EMAIL */}
//               <td className="p-3 border text-sm text-gray-600">
//                 {admin.email}
//               </td>

//               {/* ROLES */}
//               <td className="p-3 border text-sm text-blue-600">
//                 {Array.isArray(admin.roles)
//                   ? admin.roles.map((r) => r.name ?? r).join(", ")
//                   : admin.roles}
//               </td>

//               {/* STATUS */}
//               <td className="p-3 border ">
//                 {!protectedAdmin ? (
//                   <div className="flex items-center gap-2 justify-center" dir="ltr">
//                     <Switch
//                       className="data-[state=checked]:bg-green-600"
//                       checked={admin.is_active}
//                       disabled={togglingId === admin.id}
//                       onCheckedChange={() =>
//                         handleToggleStatus(admin.id)
//                       }
//                     />
//                     <span className="text-sm">
//                       {admin.is_active ? "مفعل" : "غير مفعل"}
//                     </span>
//                   </div>
//                 ) : (
//                  ""
//                 )}
//               </td>

//               {/* ACTIONS */}
//               <td className="p-3 border">
//                 {!protectedAdmin && (
//                   <div className="flex items-center justify-center gap-3">
//                     {/* EDIT */}
//                     <Link href={`/admins/edit/${admin.id}`}>
//                       <Button
//                         size="sm"
//                         className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
//                       >
//                         <Edit3 className="h-5 w-5" />
//                       </Button>
//                     </Link>

//                     {/* DELETE */}
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           className="cursor-pointer"
//                           onClick={() => setDeleteId(admin.id)}
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </Button>
//                       </AlertDialogTrigger>

//                       <AlertDialogContent dir="rtl">
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>
//                             تأكيد الحذف
//                           </AlertDialogTitle>
//                           <AlertDialogDescription>
//                             هل أنت متأكد من حذف هذا المسؤول؟
//                             <br />
//                             لا يمكن التراجع عن هذا الإجراء.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>

//                         <AlertDialogFooter>
//                           <AlertDialogCancel>
//                             إلغاء
//                           </AlertDialogCancel>
//                           <AlertDialogAction
//                             className="bg-red-600 hover:bg-red-700"
//                             onClick={handleDelete}
//                           >
//                             حذف
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </div>
// </div>

//   );
// };

// export default Admins;
