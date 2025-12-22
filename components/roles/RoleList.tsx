"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions";

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

export default function RolesPage() {
  const lang = LangUseParams();
  const dispatch = useAppDispatch();
  const { roles, loading } = useAppSelector((s) => s.roles);

  useEffect(() => {
    dispatch(ActFetchRoles());
  }, [dispatch]);

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            الأدوار
          </CardTitle>

          <Link
            href={`${lang}/roles/create`}
            className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            إضافة دور جديد
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {loading && (
            <p className="p-6 text-center text-muted-foreground">
              تحميل...
            </p>
          )}

          {!loading && roles.length === 0 && (
            <p className="p-6 text-center text-muted-foreground">
              لا توجد بيانات.
            </p>
          )}

          {!loading && roles.length > 0 && (
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
                  <RoleRow key={role.id} role={role } />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}









// "use client";

// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchRoles } from "@/store/roles/thunkActions";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import RoleRow from "./RoleRow";
// import Link from "next/link";
// import LangUseParams from "@/translate/LangUseParams";

// export default function RolesPage() {
//   const lang = LangUseParams();
//   const dispatch = useAppDispatch();
//   const { roles, loading } = useAppSelector((s) => s.roles);

  



//   useEffect(() => {
//     dispatch(ActFetchRoles());
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <Card className="rounded-2xl shadow">
//         <CardHeader>
//           <CardTitle className="text-lg font-medium">الأدوار</CardTitle>
//           <Link href={`${lang}/roles/create`} 
//           className="btn w-fit bg-blue-500 hover:bg-blue-600">اضافة دور جديد</Link>
//         </CardHeader>

//         <CardContent>
//           {loading && <p>تحميل...</p>}

//           {!loading && roles.length === 0 && (
//             <p className="text-center text-gray-500">لا توجد بيانات.</p>
//           )}

//           <div className="space-y-4">
//             {roles.map((role: any) => (
//               <RoleRow key={role.id} role={role} />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }