"use client";

import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";

import RoleRow from "./RoleRow";
import LangUseParams from "@/translate/LangUseParams";

import { useGetRolesQuery } from "@/store/roles/rolesApi";

export default function RolesPage() {
  const lang = LangUseParams();

  const {
    data: roles = [],
    isLoading,
    isFetching,
    isError,
  } = useGetRolesQuery();

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            الأدوار
          </CardTitle>

          <Link
            href={`/${lang}/roles/create`}
            className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            إضافة دور جديد
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {(isLoading || isFetching) && (
            <p className="p-6 text-center text-muted-foreground">
              تحميل...
            </p>
          )}

          {isError && (
            <p className="p-6 text-center text-destructive">
              حدث خطأ أثناء تحميل الأدوار
            </p>
          )}

          {!isLoading && roles.length === 0 && (
            <p className="p-6 text-center text-muted-foreground">
              لا توجد بيانات.
            </p>
          )}

          {!isLoading && roles.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الدور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تفعيل</TableHead>
                  <TableHead className="text-right">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {roles.map((role) => (
                  <RoleRow key={role.id} role={role} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}