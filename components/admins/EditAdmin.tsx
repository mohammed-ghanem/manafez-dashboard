/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, ShieldCheck } from "lucide-react";

import {
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
} from "@/store/admins/adminsApi";
import { useGetRolesQuery } from "@/store/roles/rolesApi";
import { useSessionReady } from "@/hooks/useSessionReady";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/* ===================== TYPES ===================== */
type EditAdminForm = {
  name: string;
  email: string;
  phone: string;
  roles_ids: number[];
  isActive: boolean;
};

export default function EditAdmin() {
  const sessionReady = useSessionReady();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: admin, isLoading } = useGetAdminByIdQuery(Number(id), {
    skip: !sessionReady,
  });

  const { data: rolesResponse, isLoading: rolesLoading } =
    useGetRolesQuery(undefined, { skip: !sessionReady });

  const roles = rolesResponse ?? [];

  const [updateAdmin, { isLoading: isUpdating }] =
    useUpdateAdminMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
  } = useForm<EditAdminForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roles_ids: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (!admin) return;

    reset({
      name: admin.name ?? "",
      email: admin.email ?? "",
      phone: admin.mobile ?? "",
      roles_ids: Array.isArray(admin.roles_ids)
        ? admin.roles_ids.map((id: number) => Number(id))
        : [],
      isActive: Boolean(admin.is_active),
    });
  }, [admin, reset]);

  const onSubmit = async (data: EditAdminForm) => {
    try {
      const res = await updateAdmin({
        id: Number(id),
        data: {
          name: data.name,
          email: data.email,
          mobile: data.phone,
          role_id: data.roles_ids,
          is_active: data.isActive,
        },
      }).unwrap();

      toast.success(res?.message || "تم التعديل بنجاح");
      router.push("/admins");
    } catch (err: any) {
      const errorData = err?.data ?? err;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg)),
        );
        return;
      }
      if (errorData?.message) {
        toast.error(errorData.message);
        return;
      }
    }
  };

  const selectedRoles = watch("roles_ids") ?? [];

  if (!sessionReady || isLoading || rolesLoading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Admin
          </CardTitle>
          <CardDescription>
            Update admin information and permissions
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    {...register("name", { required: true })}
                    placeholder="Admin name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    {...register("email", { required: true })}
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <div dir="ltr">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <PhoneInput
                      country="eg"
                      value={field.value}
                      onChange={field.onChange}
                      containerClass="!w-full"
                      inputClass="!w-full !h-10 !pl-12 !text-sm rounded-md border"
                    />
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* ROLES */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Roles & Permissions
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-lg p-4">
                {roles.map((role: any) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-2 rounded-md hover:bg-muted px-2 py-1"
                  >
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={(checked) => {
                        const newRoles = checked
                          ? [...selectedRoles, role.id]
                          : selectedRoles.filter((rid) => rid !== role.id);

                        setValue("roles_ids", newRoles, {
                          shouldDirty: true,
                        });
                      }}
                    />
                    <span className="text-sm">{role.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-3">
              <Checkbox
                checked={watch("isActive")}
                onCheckedChange={(v) =>
                  setValue("isActive", Boolean(v))
                }
              />
              <span className="text-sm">Active account</span>
            </div>

            {/* ACTION */}
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-content block mx-auto gap-2"
            >
              Update Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}