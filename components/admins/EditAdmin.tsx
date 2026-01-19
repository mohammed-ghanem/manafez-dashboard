/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import {
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
} from "@/store/admins/adminsApi";
import { useGetRolesQuery } from "@/store/roles/rolesApi";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/* ===================== TYPES ===================== */
type EditAdminForm = {
  name: string;
  email: string;
  phone: string;
  roles_ids: number[];
  isActive: boolean;
};

export default function EditAdmin() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  /* ===================== QUERIES ===================== */
  const { data: admin, isLoading } = useGetAdminByIdQuery(Number(id));
  const { data: rolesResponse, isLoading: rolesLoading } =
    useGetRolesQuery();

  const roles = rolesResponse ?? [];

  const [updateAdmin, { isLoading: isUpdating }] =
    useUpdateAdminMutation();

  /* ===================== FORM ===================== */
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

  /* ===================== FILL FORM ===================== */
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

  /* ===================== SUBMIT ===================== */
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
      if (err?.errors) {
        Object.values(err.errors).forEach((value: any) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => toast.error(msg));
          } else {
            toast.error(value);
          }
        });
      } else {
        toast.error("حدث خطأ غير متوقع");
      }
    }
  };

  const selectedRoles = watch("roles_ids") ?? [];

  if (isLoading || rolesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-4 p-6"
    >
      {/* NAME */}
      <Input {...register("name", { required: true })} placeholder="Name" />

      {/* EMAIL */}
      <Input {...register("email", { required: true })} placeholder="Email" />

      {/* PHONE (Controller REQUIRED) */}
      <div dir="ltr">
        <Controller
                
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <PhoneInput
                    country="eg"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    containerClass="!w-full"
                    inputClass="!w-full !h-10 !text-sm "
                    inputStyle={{ width: "100%" }}
                  />
                )}
              />
      </div>
      

      {/* ROLES */}
      <div className="space-y-2">
        <Label>Roles</Label>

        {roles.length === 0 && (
          <p className="text-sm text-gray-500">No roles found</p>
        )}

        {roles.map((role: any) => (
          <div key={role.id} className="flex items-center gap-2">
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoles.includes(role.id)}
              onCheckedChange={(checked) => {
                const newRoles = checked
                  ? [...selectedRoles, role.id]
                  : selectedRoles.filter((rid) => rid !== role.id);

                setValue("roles_ids", newRoles, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
            <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
          </div>
        ))}
      </div>

      {/* ACTIVE */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={watch("isActive")}
          onCheckedChange={(v) => setValue("isActive", Boolean(v))}
        />
        <span>Active</span>
      </div>

      <Button disabled={isUpdating} className="w-full">
        Update Admin
      </Button>
    </form>
  );
}