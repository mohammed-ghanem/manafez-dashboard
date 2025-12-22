"use client";

import { Role } from "@/types/roles";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

// UI
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Alert
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

// Icons
import { Edit3, Trash2, Lock } from "lucide-react";

// Logic
import { ActToggleRoleStatus } from "@/store/roles/thunkActions/ActToggleRoleStatus";
import { ActDeleteRole } from "@/store/roles/thunkActions/ActDeleteRole";
import LangUseParams from "@/translate/LangUseParams";

type Props = {
  role: Role;
};

export default function RoleRow({ role }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const lang = LangUseParams();

  const protectedNames = ["admin", "ادمن"];
  const isProtected =
    protectedNames.includes(role.name?.trim().toLowerCase() ?? "");

  const handleToggle = () => {
    if (isProtected) return;
    dispatch(
      ActToggleRoleStatus({
        id: role.id,
        is_active: !role.is_active,
      })
    );
  };

  const handleDelete = () => {
    if (isProtected) return;
    dispatch(ActDeleteRole(role.id));
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      {/* Role */}
      <TableCell>
        <div className="flex items-center gap-2 font-medium">
          {role.name}
          {isProtected && (
            <Tooltip>
              <TooltipTrigger>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>دور محمي</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {role.slug}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={role.is_active ? "default" : "secondary"}
          className={
            role.is_active
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : ""
          }
        >
          {role.is_active ? "نشط" : "غير نشط"}
        </Badge>
      </TableCell>

      {/* Toggle */}
      <TableCell dir="ltr">
        <Switch
          checked={!!role.is_active}
          onCheckedChange={handleToggle}
          disabled={isProtected}
          className="data-[state=checked]:bg-green-600"
        />
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {/* Edit */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isProtected}
                onClick={() =>
                  router.push(`${lang}/roles/edit/${role.id}`)
                }
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تعديل</TooltipContent>
          </Tooltip>

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isProtected}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>حذف الدور</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف الدور{" "}
                  <strong>{role.name}</strong>؟
                  <br />
                  هذا الإجراء لا يمكن التراجع عنه.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}





// "use client";

// import { Role } from "@/types/roles";
// import { Button } from "@/components/ui/button";
// import PermissionsAccordion from "./PermissionsAccordion";
// import { useAppDispatch } from "@/store/hooks";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { ActToggleRoleStatus } from "@/store/roles/thunkActions/ActToggleRoleStatus";
// import { ActDeleteRole } from "@/store/roles/thunkActions/ActDeleteRole";
// import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
// import LangUseParams from "@/translate/LangUseParams";
// import {
//   MoreVertical,
//   Edit3,
//   Trash2,
//   UserCheck,
//   UserX,
//   Shield,
//   Lock
// } from "lucide-react";



// type Props = {
//   role: Role;
// };

// export default function RoleRow({ role }: Props) {
//   const dispatch = useAppDispatch();
//   const lang = LangUseParams();
//   const router = useRouter();


//   // Protected role names (add any other protected variants here)
//   const protectedNames = ["admin", "ادمن"];
//   const normalized = role.name?.trim().toLowerCase() ?? "";
//   const isProtected = protectedNames.includes(normalized);


//   const handleToggle = () => {
//     if (isProtected) return;
//     dispatch(
//       ActToggleRoleStatus({
//         id: role.id,
//         is_active: !role.is_active,
//       })
//     );
//   };

//   const handleDelete = () => {
//     if (isProtected) return;
//     dispatch(ActDeleteRole(role.id));
//   };

//   const handleEdit = () => {
//     if (isProtected) return;
//     router.push(`${lang}/roles/edit/${role.id}`);
//   };

//   return (
//     <Card className="border-l-4 border-l-primary/20 hover:shadow-lg transition-all duration-200 from-white to-gray-50/50">
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-start">
//           <div className="space-y-2 flex-1">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-primary/10 rounded-lg">
//                 <Shield className="h-5 w-5 text-primary" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-3">
//                   <h3 className="font-semibold text-lg text-gray-900">
//                     {role.name}
//                   </h3>
//                   <Badge
//                     variant={role.is_active ? "default" : "secondary"}
//                     className={role.is_active
//                       ? "bg-green-100 text-green-800 hover:bg-green-100"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-100"
//                     }
//                   >
//                     {role.is_active ? "نشط" : "غير نشط"}
//                   </Badge>
//                   {isProtected && (
//                     <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1">
//                       <Lock className="h-3 w-3" /> محمي
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block mt-1">
//                   {role.slug}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Actions Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem
//               onClick={handleEdit}
//               disabled={isProtected}
//               className="flex items-center gap-2">
//                 <Edit3 className="h-4 w-4" />
//                 تعديل الدور
//               </DropdownMenuItem>
//               <DropdownMenuItem
//               onClick={handleToggle}
//               disabled={isProtected}
//               className="flex items-center gap-2">
//                 {role.is_active ? (
//                   <UserX className="h-4 w-4 text-orange-600" />
//                 ) : (
//                   <UserCheck className="h-4 w-4 text-green-600" />
//                 )}
//                 {role.is_active ? "تعطيل الدور" : "تفعيل الدور"}
//               </DropdownMenuItem>
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <DropdownMenuItem
//                     onSelect={(e) => e.preventDefault()}
//                     disabled={isProtected}
//                     className="flex items-center gap-2 text-red-600 focus:text-red-600"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                     حذف الدور
//                   </DropdownMenuItem>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent className="max-w-md">
//                   <AlertDialogHeader>
//                     <div className="flex items-center gap-3 text-red-600">
//                       <div className="p-2 bg-red-100 rounded-full">
//                         <Trash2 className="h-5 w-5" />
//                       </div>
//                       <AlertDialogTitle>حذف الدور</AlertDialogTitle>
//                     </div>
//                     <AlertDialogDescription className="pt-4 text-gray-600">
//                       <p className="font-medium text-gray-900 mb-2">هل أنت متأكد من حذف الدور؟
//                         {role.name}
//                       </p>
//                       هذا الإجراء لا يمكن التراجع عنه. سيتم حذف هذا الدور نهائيًا من النظام.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>

//                   <AlertDialogFooter className="flex gap-2 sm:gap-0">
//                     <AlertDialogCancel className="flex-1">إلغاء</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={handleDelete}
//                       className="flex-1 bg-red-600 hover:bg-red-700"
//                     >
//                       حذف الدور
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Status Toggle */}
//         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//           <Label htmlFor={`role-status-${role.id}`} className="text-sm font-medium text-gray-700">
//             حالة الدور
//           </Label>
//           <div className="flex items-center gap-3">
//             <span className={`text-sm ${role.is_active ? 'text-green-600' : 'text-gray-500'}`}>
//               {role.is_active ? 'مفعل' : 'معطل'}
//             </span>
//             <Switch
//               id={`role-status-${role.id}`}
//               checked={!!role.is_active}
//               onCheckedChange={handleToggle}
//               className="data-[state=checked]:bg-green-600"
//               disabled={isProtected}
//             />
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0">
//         <PermissionsAccordion permissions={role.permissions} />
//       </CardContent>
//     </Card>
//   );
// }