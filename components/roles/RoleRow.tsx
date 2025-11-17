"use client";

import { Role } from "@/types/roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PermissionsAccordion from "./role-permissions";

type Props = {
  role: Role;
};

export default function RoleRow({ role }: Props) {
  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-semibold">{role.name}</p>
          <p className="text-sm text-gray-500">{role.slug}</p>

          <Badge variant={role.is_active ? "default" : "secondary"}>
            {role.is_active ? "مفعل" : "غير مفعل"}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">تعديل</Button>
          <Button variant="destructive" size="sm">حذف</Button>
        </div>
      </div>

      {/* Permissions */}
      <div className="mt-4">
        <PermissionsAccordion permissions={role.permissions} />
      </div>
    </div>
  );
}
