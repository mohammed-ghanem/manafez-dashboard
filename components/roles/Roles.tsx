/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";

import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TABLE_HEADERS } from "@/constants/tableHeaders";
import { useSessionReady } from "@/hooks/useSessionReady";
import { useOptimisticToggle } from "@/hooks/useOptimisticToggle";

import {
  useGetRolesQuery,
  useToggleRoleStatusMutation,
  useDeleteRoleMutation,
} from "@/store/roles/rolesApi";

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

import { Column, DataTable } from "../datatable/DataTable";
import { toast } from "sonner";
import { Edit3, Trash2 } from "lucide-react";

type Role = {
  id: number;
  name: string;
  is_active: boolean;
};

export default function RolesPage() {
  const lang = LangUseParams() as "ar" | "en";
  const translate = TranslateHook();
  const sessionReady = useSessionReady();

  const headers = TABLE_HEADERS[lang].roles;

  const {
    data: rolesData = [],
    isLoading,
    isFetching,
    isError,
  } = useGetRolesQuery(undefined, {
    skip: !sessionReady,
    refetchOnMountOrArgChange: false,
  });

  const roles: Role[] = rolesData.map((role: any) => ({
    ...role,
    is_active: Boolean(role.is_active),
  }));

  const [toggleStatus] = useToggleRoleStatusMutation();
  const [deleteRole] = useDeleteRoleMutation();

  /* ===================== OPTIMISTIC TOGGLE ===================== */
  const { getOptimisticStatus, toggle, isPending } =
    useOptimisticToggle<Role>({
      getId: (role) => role.id,
      getStatus: (role) => role.is_active,
      onToggle: async (role) => {
        await toggleStatus({
          id: role.id,
          is_active: !role.is_active,
        }).unwrap();
        return;
      },
    });

  /* ===================== DELETE HANDLER ===================== */
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteRole(deleteId).unwrap() as any;
      toast.success(res?.message);
    } catch (err: any) {
      const errorData = err?.data ?? err;

      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg))
        );
        return;
      }

      if (errorData?.message) {
        toast.error(errorData.message);
        return;
      }
    }
  };

  /* ===================== COLUMNS ===================== */
  const columns: Column<Role>[] = [
    {
      key: "name",
      header: headers.name,
    },
    {
      key: "is_active",
      header: headers.status,
      align: "center",
      render: (_, role) => (
        <div className="flex items-center justify-center gap-2" dir="ltr">
          <Switch
            className="data-[state=checked]:bg-green-600"
            checked={getOptimisticStatus(role)}
            disabled={isPending(role)}
            onCheckedChange={(checked) => {
              toggle(role, checked).catch(() => {
                toast.error("Can't update status");
              });
            }}
          />

          <span className="text-sm">
            {getOptimisticStatus(role)
              ? translate?.pages.roles.active || ""
              : translate?.pages.roles.inactive || ""}
          </span>
        </div>
      ),
    },
    {
      key: "id",
      header: headers.actions,
      align: "right",
      render: (_, role) => (
        <div className="flex justify-center gap-2">
          {/* EDIT */}
          <Link href={`/${lang}/roles/edit/${role.id}`}>
            <Button
              className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 cursor-pointer"
              size="sm"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </Link>

          {/* DELETE */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="cursor-pointer"
                size="sm"
                variant="destructive"
                onClick={() => setDeleteId(role.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader className="text-start!">
                <AlertDialogTitle>
                  {translate?.pages.roles.deleteTitle || ""}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {translate?.pages.roles.deleteMessage}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  {translate?.pages.roles.cancelBtn || ""}
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600"
                  onClick={handleDelete}
                >
                  {translate?.pages.roles.deleteBtn || ""}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  /* ===================== STATES ===================== */
  const showSkeleton = !sessionReady || isLoading || isFetching;

  if (isError) {
    return (
      <p className="p-6 text-center text-destructive">
        {lang === "ar"
          ? "حدث خطأ أثناء تحميل الأدوار"
          : "Failed to load roles"}
      </p>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="p-6 mx-4 my-10 bg-white rounded-2xl border space-y-6">
      <h2 className={`titleStyle ${showSkeleton ? "block h-11 w-38!" : ""}`}>
        {translate?.pages.roles.rolesTitle || ""}
      </h2>

      <div className="mt-10">
        <Link
          href={`/${lang}/roles/create`}
          className={`createBtn ${showSkeleton
            ? "block w-40 h-9 py-2.5 opacity-50"
            : ""
            }`}
        >
          {!showSkeleton &&
            `${translate?.pages.roles.createRole.title || ""}`}
        </Link>
      </div>

      <DataTable
        data={roles}
        columns={columns}
        isSkeleton={showSkeleton}
        searchPlaceholder={`${translate?.pages.roles.searchPlaceholder || ""}`}
      />
    </div>
  );
}













// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import Link from "next/link";
// import LangUseParams from "@/translate/LangUseParams";
// import TranslateHook from "@/translate/TranslateHook";

// import { Switch } from "@/components/ui/switch";
// import { TABLE_HEADERS } from "@/constants/tableHeaders";
// import { useSessionReady } from "@/hooks/useSessionReady";
// import { useOptimisticToggle } from "@/hooks/useOptimisticToggle";

// import {
//   useGetRolesQuery,
//   useToggleRoleStatusMutation,
//   useDeleteRoleMutation,
// } from "@/store/roles/rolesApi";

// import { Column, DataTable } from "../datatable/DataTable";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import { Edit3 } from "lucide-react";

// type Role = {
//   id: number;
//   name: string;
//   is_active: boolean;
// };

// export default function RolesPage() {
//   const lang = LangUseParams() as "ar" | "en";
//   const translate = TranslateHook();
//   const sessionReady = useSessionReady();

//   const headers = TABLE_HEADERS[lang].roles;

//   const {
//     data: rolesData = [],
//     isLoading,
//     isFetching,
//     isError,
//   } = useGetRolesQuery(undefined, {
//     skip: !sessionReady,
//     refetchOnMountOrArgChange: false,
//   });

//   const roles: Role[] = rolesData.map((role: any) => ({
//     ...role,
//     is_active: Boolean(role.is_active),
//   }));

//   const [toggleStatus] = useToggleRoleStatusMutation();
//   const [deleteRole] = useDeleteRoleMutation();

//   /* ===================== OPTIMISTIC TOGGLE ===================== */
//   const { getOptimisticStatus, toggle, isPending } =
//     useOptimisticToggle<Role>({
//       getId: (role) => role.id,
//       getStatus: (role) => role.is_active,
//       onToggle: async (role) => {
//         await toggleStatus({ id: role.id, is_active: !role.is_active });
//         return;
//       },

//     });

//   /* ===================== COLUMNS ===================== */
//   const columns: Column<Role>[] = [
//     {
//       key: "name",
//       header: headers.name,
//     },
//     {
//       key: "is_active",
//       header: headers.status,
//       align: "center",
//       render: (_, role) => (
//         <div className="flex items-center justify-center gap-2" dir="ltr">
//           <Switch
//             className="data-[state=checked]:bg-green-600"
//             checked={getOptimisticStatus(role)}
//             disabled={isPending(role)}
//             onCheckedChange={(checked) => {
//               toggle(role, checked).catch(() => {
//                 toast.error(
//                   lang === "ar"
//                     ? "فشل تغيير الحالة"
//                     : "Failed to update status"
//                 );
//               });
//             }}
//           />

//           <span className="text-sm">
//             {getOptimisticStatus(role)
//               ? translate?.pages.roles.active || ""
//               : translate?.pages.roles.inactive || ""}
//           </span>
//         </div>
//       ),
//     },
//     {
//       key: "id",
//       header: headers.actions,
//       align: "right",
//       render: (_, role) => (
//         <div className="flex justify-end gap-3 text-sm">
//           <Link
//             href={`/${lang}/roles/edit/${role.id}`}
//             className="text-blue-600 hover:underline"
//           >
//             <Button
//               className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 cursor-pointer"
//               size="sm"
//             >
//               <Edit3 className="h-4 w-4" />
//             </Button>
//           </Link>

//           <button
//             onClick={async () => {
//               try {
//                 await deleteRole(role.id).unwrap();
//                 toast.success(
//                   lang === "ar" ? "تم حذف الدور" : "Role deleted"
//                 );
//               } catch {
//                 toast.error(
//                   lang === "ar" ? "فشل الحذف" : "Delete failed"
//                 );
//               }
//             }}
//             className="text-red-600 hover:underline"
//           >
//             {translate?.pages.roles.delete || "حذف"}
//           </button>
//         </div>
//       ),
//     },
//   ];

//   /* ===================== STATES ===================== */
//   const showSkeleton = !sessionReady || isLoading || isFetching;

//   if (isError) {
//     return (
//       <p className="p-6 text-center text-destructive">
//         {lang === "ar"
//           ? "حدث خطأ أثناء تحميل الأدوار"
//           : "Failed to load roles"}
//       </p>
//     );
//   }

//   /* ===================== UI ===================== */
//   return (
//     <div className="p-6 mx-4 my-10 bg-white rounded-2xl border space-y-6">
//       <h2 className={`titleStyle ${showSkeleton ? "block h-11 w-38!" : ""}`}>
//         {translate?.pages.roles.rolesTitle || ""}
//       </h2>

//       <div className="mt-10">
//         <Link
//           href={`/${lang}/roles/create`}
//           className={`createBtn ${showSkeleton
//             ? "block w-40 h-9 py-2.5 opacity-50"
//             : ""
//             }`}
//         >
//           {!showSkeleton &&
//             `${translate?.pages.roles.createRole.title || ""}`}
//         </Link>
//       </div>

//       <DataTable
//         data={roles}
//         columns={columns}
//         isSkeleton={showSkeleton}
//         searchPlaceholder={`${translate?.pages.roles.searchPlaceholder || ""}`}
//       />
//     </div>
//   );
// }