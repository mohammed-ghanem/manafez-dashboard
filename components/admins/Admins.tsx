"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchAdmins } from "@/store/admins/thunkActions/ActAdmins";
import { Button } from "@/components/ui/button";
import { IAdmin } from "@/types/admins";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import LangUseParams from "@/translate/LangUseParams";
import Link from "next/link";
import { ActDeleteAdmin } from "@/store/admins/thunkActions/ActDeleteAdmin";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ActToggleAdminStatus } from "@/store/admins/thunkActions/ActToggleAdminStatus";

import { Switch } from "@/components/ui/switch";
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


export default function Admins() {
  const dispatch = useAppDispatch();
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const router = useRouter();
  const lang =  LangUseParams();

  // typed selector from your hooks
  const { list, status, error } = useAppSelector((s) => s.admins);

  useEffect(() => {
    dispatch(ActFetchAdmins());
  }, [dispatch]);

  const protectedNames = ["admin", "ادمن"];

  const onEdit = (id: number) => {
    // update route to your edit page
    router.push(`/${lang}/admins/edit/${id}`);
  };

  // const handleDelete = async (id: number) => {
  //   const confirmDelete = confirm(
  //     "Are you sure you want to delete this admin?"
  //   );
  
  //   if (!confirmDelete) return;
  
  //   try {
  //     await dispatch(ActDeleteAdmin(id)).unwrap();
  //     toast.success("Admin deleted successfully");
  //   } catch (err: any) {
  //     toast.error(err || "Delete failed");
  //   }
  // };


  const handleDelete = async (id: number) => {
    try {
      await dispatch(ActDeleteAdmin(id)).unwrap();
      toast.success("تم حذف المسؤول بنجاح");
    } catch (err: any) {
      toast.error(err || "فشل الحذف");
    } finally {
      setDeleteId(null);
    }
  };
  


  const handleToggleStatus = async (id: number) => {
    try {
      await dispatch(ActToggleAdminStatus(id)).unwrap();
      toast.success("تم تحديث حالة المسؤول");
    } catch (err: any) {
      toast.error(err || "فشل تحديث الحالة");
    }
  };
  



  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">المسؤولون</h1>
        <Link href={`/${lang}/admins/create`} 
        className="btn btn-primary cursor-pointer">
          انشاء مسؤول
        </Link>
      </div>

      {status === "loading" && <div>جاري التحميل...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">الاسم</th>
              <th className="py-2 px-3">البريد</th>
              <th className="py-2 px-3">الجوال</th>
              <th className="py-2 px-3">الحالة</th>
              <th className="py-2 px-3">الأدوار</th>
              <th className="py-2 px-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && status !== "loading" && (
              <tr>
                <td colSpan={7} className="py-4 px-3 text-center text-gray-600">
                  لا توجد بيانات
                </td>
              </tr>
            )}

            {list.map((a: IAdmin, idx: number) => {
              const normalized = (a.name ?? "").trim().toLowerCase();
              const isProtected = protectedNames.includes(normalized);

              return (
                <tr key={a.id} className="border-b last:border-b-0">
                  <td className="py-2 px-3 align-top">{idx + 1}</td>
                  <td className="py-2 px-3 align-top flex items-center gap-2">
                    {a.image ? (
                      <img src={a.image} alt={a.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : null}
                    <span>{a.name}</span>
                    {isProtected && <Badge className="mr-2">محمي</Badge>}
                  </td>
                  <td className="py-2 px-3 align-top">{a.email}</td>
                  <td className="py-2 px-3 align-top">{a.mobile}</td>
                  <td className="py-2 px-3 align-top">

                        {/* {a.is_active ? "مفعل" : "معطل"} */}
                      <div className="flex items-center gap-2" dir="ltr">
                        <Switch
                          checked={a.is_active}
                          disabled={isProtected || status === "loading"}
                          onCheckedChange={() => handleToggleStatus(a.id)}
                        />

                        <span className="text-sm">
                          {a.is_active ? "مفعل" : "معطل"}
                        </span>
                      </div>

                    </td>
                  <td className="py-2 px-3 align-top">
                    {Array.isArray(a.roles) ? a.roles.join(", ") : a.roles}
                  </td>
                  <td className="py-2 px-3 align-top flex gap-2">
                  <Button
                      size="sm"
                      onClick={() => onEdit(a.id)}
                      disabled={isProtected || status === "loading"}
                    >
                      تعديل
                    </Button>

                    {/* delete admin */}

                    {/* <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button> */}


<AlertDialog>
  <AlertDialogTrigger asChild>
    <button
      disabled={isProtected || status === "loading"}
      onClick={() => setDeleteId(a.id)}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      <Trash2 size={18} />
        </button>
              </AlertDialogTrigger>

              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من حذف هذا المسؤول؟  
                    لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>

                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDelete(deleteId!)}
                  >
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>



                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
