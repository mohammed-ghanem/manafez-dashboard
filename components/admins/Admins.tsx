"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchAdmins, ActDeleteAdmin, ActToggleAdminStatus } from "@/store/admins/thunkActions/ActAdmins";
import { Button } from "@/components/ui/button";
import { IAdmin } from "@/types/admins";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Admins() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // typed selector from your hooks
  const { list, status, error } = useAppSelector((s) => s.admins);

  console.log(list[0]);

  useEffect(() => {
    dispatch(ActFetchAdmins());
  }, [dispatch]);

  const protectedNames = ["admin", "ادمن"];

  const onEdit = (id: number) => {
    // update route to your edit page
    router.push(`/admins/edit/${id}`);
  };

  const onDelete = (id: number, name?: string) => {
    const normalized = (name ?? "").trim().toLowerCase();
    if (protectedNames.includes(normalized)) return;
    if (!confirm("هل أنت متأكد من حذف المسؤول؟")) return;
    dispatch(ActDeleteAdmin(id));
  };

  const onToggle = (a: IAdmin) => {
    const normalized = (a.name ?? "").trim().toLowerCase();
    if (protectedNames.includes(normalized)) return;
    dispatch(ActToggleAdminStatus({ id: a.id, is_active: !a.is_active }));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">المسؤولون</h1>
        <Button onClick={() => router.push("/admins/create")}>إنشاء مسؤول</Button>
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
                      // small avatar if available
                      // adjust image component if you use next/image
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.image} alt={a.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : null}
                    <span>{a.name}</span>
                    {isProtected && <Badge className="mr-2">محمي</Badge>}
                  </td>
                  <td className="py-2 px-3 align-top">{a.email}</td>
                  <td className="py-2 px-3 align-top">{a.mobile}</td>
                  <td className="py-2 px-3 align-top">{a.is_active ? "مفعل" : "معطل"}</td>
                  <td className="py-2 px-3 align-top">
                    {Array.isArray(a.roles) ? a.roles.join(", ") : a.roles}
                  </td>
                  <td className="py-2 px-3 align-top flex gap-2">
                    <Button size="sm" onClick={() => onEdit(a.id)} disabled={isProtected}>
                      تعديل
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => onToggle(a)} disabled={isProtected}>
                      {a.is_active ? "تعطيل" : "تفعيل"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(a.id, a.name)} disabled={isProtected}>
                      حذف
                    </Button>
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
