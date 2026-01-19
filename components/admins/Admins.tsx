/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Edit3, Trash2 } from "lucide-react";



const Admins = () => {
  const lang = LangUseParams();
  const { data: admins = [], isLoading } = useGetAdminsQuery();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [deleteId, setDeleteId] = useState<number | null>(null);
 
   const [toggleStatus] = useToggleAdminStatusMutation();
   const [togglingId, setTogglingId] = useState<number | null>(null);


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
  
 
  const handleDelete = async () => {
    if (!deleteId) return;
  
    try {
     
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

 
  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
     await toggleStatus(id).unwrap();
    setTogglingId(null);
  };

  

  if (isLoading) return <div>Loading...</div>;

  return (
 

    <div className="p-6 mx-4 my-10 bg-white rounded-2xl border border-[#ddd] space-y-6">
  <div>
    <Link
      href={`/${lang}/admins/create`}
      className="createBtn"
    >
      انشاء مسؤول جديد
    </Link>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      {/* ===== TABLE HEADER ===== */}
      <thead>
        <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Email</th>
          <th className="p-3 border">Roles</th>
          <th className="p-3 border">Status</th>
          <th className="p-3 border text-center">Actions</th>
        </tr>
      </thead>

      {/* ===== TABLE BODY ===== */}
      <tbody>
        {admins.map((admin) => {
          const protectedAdmin = isProtectedAdmin(admin.roles);

          return (
            <tr
              key={admin.id}
              className="hover:bg-gray-50 transition"
            >
              {/* NAME */}
              <td className="p-3 border">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{admin.name}</span>
                  {protectedAdmin && (
                    <Badge variant="secondary">محمي</Badge>
                  )}
                </div>
              </td>

              {/* EMAIL */}
              <td className="p-3 border text-sm text-gray-600">
                {admin.email}
              </td>

              {/* ROLES */}
              <td className="p-3 border text-sm text-blue-600">
                {Array.isArray(admin.roles)
                  ? admin.roles.map((r) => r.name ?? r).join(", ")
                  : admin.roles}
              </td>

              {/* STATUS */}
              <td className="p-3 border ">
                {!protectedAdmin ? (
                  <div className="flex items-center gap-2 justify-center" dir="ltr">
                    <Switch
                      className="data-[state=checked]:bg-green-600"
                      checked={admin.is_active}
                      disabled={togglingId === admin.id}
                      onCheckedChange={() =>
                        handleToggleStatus(admin.id)
                      }
                    />
                    <span className="text-sm">
                      {admin.is_active ? "مفعل" : "غير مفعل"}
                    </span>
                  </div>
                ) : (
                 ""
                )}
              </td>

              {/* ACTIONS */}
              <td className="p-3 border">
                {!protectedAdmin && (
                  <div className="flex items-center justify-center gap-3">
                    {/* EDIT */}
                    <Link href={`/admins/edit/${admin.id}`}>
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      >
                        <Edit3 className="h-5 w-5" />
                      </Button>
                    </Link>

                    {/* DELETE */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => setDeleteId(admin.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            تأكيد الحذف
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف هذا المسؤول؟
                            <br />
                            لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            إلغاء
                          </AlertDialogCancel>
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default Admins;