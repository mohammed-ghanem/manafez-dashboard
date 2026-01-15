/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  useGetAdminsQuery,
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
} from "@/store/admins/adminsApi";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import Link from "next/link";
import { useState } from "react";
import LangUseParams from "@/translate/LangUseParams";



const Admins = () => {
  const lang = LangUseParams();
  const { data: admins = [], isLoading } = useGetAdminsQuery();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // const [toggleStatus, { isLoading: isToggling }] = useToggleAdminStatusMutation();
   const [toggleStatus] = useToggleAdminStatusMutation();
   const [togglingId, setTogglingId] = useState<number | null>(null); // لتتبع تبديل الحالة


  const isProtectedAdmin = (roles: any) => {
    if (Array.isArray(roles)) {
      return roles.some(
        (r) =>
          r === "admin" || 
          r === "أدمن" ||
          r === "ادمن" ||
          r?.name === "admin" ||
          r?.name === "أدمن" ||
          r?.name === "ادمن"
      );
    }
  
    return roles === "admin" || roles === "أدمن" || roles === "ادمن";
  };
  
  // ✅ دالة الحذف الصحيحة
  const handleDelete = async () => {
    if (!deleteId) return;
  
    try {
      // ✅ استخدام deleteAdmin بدلاً من toggleStatus
      const res = await deleteAdmin(deleteId).unwrap();
     
      toast.success(
        <span className="font-cairo font-bold">
          {res?.message || "تم حذف المسؤول بنجاح"}
        </span>
      );
    } catch (err: any) {
      console.error("Delete error:", err);
      
      if (err?.errors) {
        Object.values(err.errors).forEach((value: any) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => toast.error(msg));
          } else {
            toast.error(value);
          }
        }); 
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("حدث خطأ أثناء الحذف");
      }
    } finally {
      setDeleteId(null);
    }
  };

  // ✅ دالة تغيير الحالة
  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
     await toggleStatus(id).unwrap();
    setTogglingId(null);
  };

  // const handleDelete = async () => {
  //   if (!deleteId) return;
  
  //   try {

  //     const res = await toggleStatus(deleteId).unwrap();
  //     console.log(res)
     
  //     toast.success(
  //       <span className="font-cairo font-bold">
  //         {res?.message || "تم" }
  //       </span>
  //     );
  //   } catch (err: any) {
  //     if (err?.errors) {
  //       Object.values(err.errors).forEach((value: any) => {
  //         if (Array.isArray(value)) {
  //           value.forEach((msg) => toast.error(msg));
  //         } else {
  //           toast.error(value);
  //         }
  //       }); 
  //       return;
  //     }
  //   } finally {
  //     setDeleteId(null);
  //   }
  // };
  

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4" >
      <div>
        <Link href={`/${lang}/admins/create`} className="btn btn-primary">create new admin</Link>
      </div>
      {admins.map((admin) => {
        const protectedAdmin = isProtectedAdmin(admin.roles);

        return (
          <div
            key={admin.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            {/* INFO */}
            <div>
              <p className="font-medium flex items-center gap-2">
                {admin.name}
                {protectedAdmin && (
                  <Badge variant="secondary">محمي</Badge>
                )}
              </p>
              <p className="text-sm text-gray-500">{admin.email}</p>
              <p className="text-xs text-blue-600">
                {Array.isArray(admin.roles)
                  ? admin.roles.map((r) => r.name ?? r).join(", ")
                  : admin.roles}
              </p>
            </div>

            {/* ACTIONS */}
            {!protectedAdmin && (
              <div className="flex items-center gap-4" >
                {/* STATUS */}
                <div className="flex items-center gap-2" dir="ltr">
                  <Switch
                    checked={admin.is_active}
                    // disabled={isToggling}
                    onCheckedChange={() => handleToggleStatus(admin.id)}
                  />
                  <span className="text-sm">
                    {admin.is_active ? "مفعل" : "غير مفعل"}
                  </span>
                </div>

                {/* EDIT */}
                <Link href={`/admins/edit/${admin.id}`}>
                  <Button size="sm">تعديل</Button>
                </Link>

                {/* DELETE */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(admin.id)}
                    >
                      حذف
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف هذا المسؤول؟
                        <br />
                        لا يمكن التراجع عن هذا الإجراء.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDelete}
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Admins;