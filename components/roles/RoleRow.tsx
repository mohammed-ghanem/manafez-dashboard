"use client";

import { Role } from "@/types/roles";
import { Button } from "@/components/ui/button";
import PermissionsAccordion from "./PermissionsAccordion";
import { useAppDispatch } from "@/store/hooks";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ActToggleRoleStatus } from "@/store/roles/thunkActions/ActToggleRoleStatus";
import { ActDeleteRole } from "@/store/roles/thunkActions/ActDeleteRole";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import LangUseParams from "@/translate/LangUseParams";
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield
} from "lucide-react";

type Props = {
  role: Role;
};

export default function RoleRow({ role }: Props) {
  const dispatch = useAppDispatch();
  const lang = LangUseParams();
  const router = useRouter();

  const handleToggle = () => {
    dispatch(
      ActToggleRoleStatus({
        id: role.id,
        is_active: !role.is_active,
      })
    );
  };

  const handleDelete = () => {
    dispatch(ActDeleteRole(role.id));
  };

  const handleEdit = () => {
    router.push(`${lang}/roles/edit/${role.id}`);
  };

  return (
    <Card className="border-l-4 border-l-primary/20 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {role.name}
                  </h3>
                  <Badge 
                    variant={role.is_active ? "default" : "secondary"}
                    className={role.is_active 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {role.is_active ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block mt-1">
                  {role.slug}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                تعديل الدور
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggle} className="flex items-center gap-2">
                {role.is_active ? (
                  <UserX className="h-4 w-4 text-orange-600" />
                ) : (
                  <UserCheck className="h-4 w-4 text-green-600" />
                )}
                {role.is_active ? "تعطيل الدور" : "تفعيل الدور"}
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف الدور
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3 text-red-600">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <AlertDialogTitle>حذف الدور</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pt-4 text-gray-600">
                      <p className="font-medium text-gray-900 mb-2">هل أنت متأكد من حذف الدور "{role.name}"؟</p>
                      هذا الإجراء لا يمكن التراجع عنه. سيتم حذف هذا الدور نهائيًا من النظام.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="flex gap-2 sm:gap-0">
                    <AlertDialogCancel className="flex-1">إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      حذف الدور
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Label htmlFor={`role-status-${role.id}`} className="text-sm font-medium text-gray-700">
            حالة الدور
          </Label>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${role.is_active ? 'text-green-600' : 'text-gray-500'}`}>
              {role.is_active ? 'مفعل' : 'معطل'}
            </span>
            <Switch
              id={`role-status-${role.id}`}
              checked={!!role.is_active}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <PermissionsAccordion permissions={role.permissions} />
      </CardContent>
    </Card>
  );
}