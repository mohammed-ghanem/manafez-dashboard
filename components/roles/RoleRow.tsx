/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Role } from "@/types/roles";
import { useRouter } from "next/navigation";

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
import {
  useToggleRoleStatusMutation,
  useDeleteRoleMutation,
} from "@/store/roles/rolesApi";

// Notifications
import { toast } from "sonner";

import LangUseParams from "@/translate/LangUseParams";

type Props = {
  role: Role;
};

export default function RoleRow({ role }: Props) {
  const router = useRouter();
  const lang = LangUseParams();

  const [toggleRoleStatus] = useToggleRoleStatusMutation();
  const [deleteRole, { isLoading: isDeleting }] =
    useDeleteRoleMutation();

  const protectedNames = ["admin", "ادمن"];
  const isProtected =
    protectedNames.includes(role.name?.trim().toLowerCase() ?? "");

  const handleToggle = async () => {
    if (isProtected) return;

    await toggleRoleStatus({
      id: role.id,
      is_active: !role.is_active,
    });
  };

const handleDelete = async () => {
  if (isProtected) return;

  try {
    await deleteRole(role.id).unwrap();
    toast.success("تم حذف الدور بنجاح");
  } catch (error) {
    toast.error("حدث خطأ أثناء حذف الدور");
  }
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
                disabled={isProtected || isDeleting}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent> 
              <AlertDialogHeader>
                <AlertDialogTitle>
                  حذف الدور
                </AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف الدور{" "}
                  <strong>{role.name}</strong>؟
                  <br />
                  هذا الإجراء لا يمكن التراجع عنه.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  إلغاء
                </AlertDialogCancel>
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