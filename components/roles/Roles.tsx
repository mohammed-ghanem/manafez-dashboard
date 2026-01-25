"use client";

import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle, 
  CardContent,
} from "@/components/ui/card";

import LangUseParams from "@/translate/LangUseParams";
import { TABLE_HEADERS } from "@/constants/tableHeaders";
import { useSessionReady } from "@/hooks/useSessionReady";

import {
  useGetRolesQuery,
  useToggleRoleStatusMutation,
  useDeleteRoleMutation,
} from "@/store/roles/rolesApi";

import { Column, DataTable } from "../datatable/DataTable";
import { toast } from "sonner";

type Role = {
  id: number;
  name: string;
  is_active: boolean;
};

export default function RolesPage() {
  const lang = LangUseParams() as "ar" | "en";
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

  const roles: Role[] = rolesData.map((role) => ({
    ...role,
    is_active: Boolean(role.is_active),
  }));

  const [toggleStatus] = useToggleRoleStatusMutation();
  const [deleteRole] = useDeleteRoleMutation();

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
        <Switch
          checked={role.is_active}
          className="data-[state=checked]:bg-green-600"
          onCheckedChange={async () => {
            try {
              await toggleStatus({
                id: role.id,
                is_active: !role.is_active,
              }).unwrap();
            } catch {
              toast.error(
                lang === "ar"
                  ? "فشل تغيير الحالة"
                  : "Failed to update status"
              );
            }
          }}
        />
      ),
    },
    {
      key: "id",
      header: headers.actions,
      align: "right",
      render: (_, role) => (
        <div className="flex justify-end gap-3 text-sm">
          <Link
            href={`/${lang}/roles/edit/${role.id}`}
            className="text-blue-600 hover:underline"
          >
            تعديل
          </Link>

          <button
            onClick={async () => {
              
              const deletedRole = role;
              try {
                await deleteRole(role.id).unwrap();
                toast.success(
                  lang === "ar"
                    ? "تم حذف الدور"
                    : "Role deleted"
                );
              } catch {
                toast.error(
                  lang === "ar"
                    ? "فشل الحذف"
                    : "Delete failed"
                );
              }
            }}
            className="text-red-600 hover:underline"
          >
            حذف
          </button>
        </div>
      ),
    },
  ];

  /* ===================== STATES ===================== */

  const showSkeleton = !sessionReady || isLoading || isFetching;


  if (isError) {
    return (
      <p className="p-6 text-center text-destructive">
        حدث خطأ أثناء تحميل الأدوار
      </p>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{headers.name}</CardTitle>

          <Link
            href={`/${lang}/roles/create`}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            إضافة دور جديد
          </Link>
        </CardHeader>

        <CardContent>
          <DataTable
            data={roles}
            columns={columns}
            isSkeleton={showSkeleton}
            searchPlaceholder={
              lang === "ar"
                ? "بحث عن دور..."
                : "Search role..."
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
