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

import { Edit3, ShieldX, Trash2 } from "lucide-react";
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
  const lang = LangUseParams();
  const translate = TranslateHook();

  const headers = TABLE_HEADERS[lang as "ar" | "en"].admins;

  const { data: admins = [], isLoading, isError, } = useGetAdminsQuery(undefined, { skip: !sessionReady, });
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
                ? translate?.pages.admins.active || ""
                : translate?.pages.admins.inactive || ""}
            </span>

          </div>
        ) : (
          <Badge variant="destructive">
            {translate?.pages.admins.protect || ""}
            <ShieldX />
          </Badge>),
    },
    {
      key: "id",
      header: headers.actions,
      align: "center",
      render: (_, admin) =>
        !isProtectedAdmin(admin.roles) ? (
          <div className="flex justify-center gap-2">
            {/* EDIT */}
            <Link href={`/${lang}/admins/edit/${admin.id}`}>
              <Button 
              className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 cursor-pointer"
              size="sm">
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
                  onClick={() => setDeleteId(admin.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent >
                <AlertDialogHeader className="text-start!">
                  <AlertDialogTitle>
                    {translate?.pages.admins.deleteTitle || ""}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {translate?.pages.admins.deleteMessage || ""}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {translate?.pages.admins.cancelBtn || ""}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600"
                    onClick={handleDelete}
                  >
                    {translate?.pages.admins.deleteBtn || ""}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <Badge variant="destructive">
            {translate?.pages.admins.protect || ""}
            <ShieldX />
          </Badge>
        )
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
