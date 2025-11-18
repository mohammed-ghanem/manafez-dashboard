"use client";

import { Role } from "@/types/roles";
import { Button } from "@/components/ui/button";
import PermissionsAccordion from "./PermissionsAccordion";
import { useAppDispatch } from "@/store/hooks";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ActToggleRoleStatus } from "@/store/roles/thunkActions/ActToggleRoleStatus";

type Props = {
  role: Role;
};

export default function RoleRow({ role }: Props) {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(
      ActToggleRoleStatus({
        id: role.id,
        is_active: !role.is_active,
      })
    );
  };

  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-semibold">{role.name}</p>
          <p className="text-sm text-gray-500">{role.slug}</p>

          <div className="flex items-center gap-2 mt-2">
            <Label className="text-sm">حالة الدور</Label>
            <Switch checked={!!role.is_active} onCheckedChange={handleToggle} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">تعديل</Button>
          <Button variant="destructive" size="sm">حذف</Button>
        </div>
      </div>

      <div className="mt-4">
        <PermissionsAccordion permissions={role.permissions} />
      </div>
    </div>
  );
}





// "use client";

// import { Role } from "@/types/roles";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import PermissionsAccordion from "./PermissionsAccordion";

// type Props = {
//   role: Role;
// };

// export default function RoleRow({ role }: Props) {
//   return (
//     <div className="border p-4 rounded-xl shadow-sm bg-white">
//       <div className="flex justify-between items-center">
//         <div className="space-y-1">
//           <p className="font-semibold">{role.name}</p>
//           <p className="text-sm text-gray-500">{role.slug}</p>

//           <Badge variant={role.is_active ? "default" : "secondary"}>
//             {role.is_active ? "مفعل" : "غير مفعل"}
//           </Badge>
//         </div>

//         <div className="flex gap-2">
//           <Button variant="outline" size="sm">تعديل</Button>
//           <Button variant="destructive" size="sm">حذف</Button>
//         </div>
//       </div>

//       {/* Permissions */}
//       <div className="mt-4">
//         <PermissionsAccordion permissions={role.permissions} />
//       </div>
//     </div>
//   );
// }
