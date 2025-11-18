"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleRow from "./RoleRow";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const { roles, loading } = useAppSelector((s) => s.roles);

  useEffect(() => {
    dispatch(ActFetchRoles());
  }, [dispatch]);

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg font-medium">الأدوار</CardTitle>
        </CardHeader>

        <CardContent>
          {loading && <p>تحميل...</p>}

          {!loading && roles.length === 0 && (
            <p className="text-center text-gray-500">لا توجد بيانات.</p>
          )}

          <div className="space-y-4">
            {roles.map((role: any) => (
              <RoleRow key={role.id} role={role} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}