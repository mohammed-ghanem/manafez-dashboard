"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchAdminById } from "@/store/admins/thunkActions/ActFetchAdminById";
import { ActUpdateAdmin } from "@/store/admins/thunkActions/ActUpdateAdmin";
import { ActFetchRoles } from "@/store/roles/thunkActions/ActFetchRoles";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/* ===================== TYPES ===================== */

type EditAdminForm = {
  name: string;
  email: string;
  phone: string;
  roles_ids: number[]; // MULTI ROLES
  isActive: boolean;
};

/* ===================== COMPONENT ===================== */

export default function EditAdmin() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selected, status } = useAppSelector((s) => s.admins);
  const { roles } = useAppSelector((s) => s.roles);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<EditAdminForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roles_ids: [],
      isActive: true,
    },
  });

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    dispatch(ActFetchRoles());
    dispatch(ActFetchAdminById(Number(id)));
  }, [dispatch, id]);

  /* ===================== FILL FORM ===================== */

  useEffect(() => {
    if (!selected) return;

    reset({
      name: selected.name,
      email: selected.email,
      phone: selected.mobile,
      roles_ids: selected.roles_ids, // IMPORTANT
      isActive: selected.is_active,
    });
  }, [selected, reset]);

  /* ===================== SUBMIT ===================== */

  const onSubmit = async (data: EditAdminForm) => {
    await dispatch(
      ActUpdateAdmin({
        id: Number(id),
        data: {
          name: data.name,
          email: data.email,
          mobile: data.phone,
          role_id: data.roles_ids, // API expects array
          is_active: data.isActive ? 1 : 0,
        },
      })
    ).unwrap();

    router.push("/admins");
  };

  /* ===================== WATCH ===================== */

  const selectedRoles = watch("roles_ids");

  /* ===================== UI ===================== */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-4 p-6"
    >
      <Input placeholder="Name" {...register("name", { required: true })} />
      <Input placeholder="Email" {...register("email", { required: true })} />
      <Input placeholder="Phone" {...register("phone")} />

      {/* ===================== ROLES ===================== */}
      <div className="space-y-2">
        <Label>Roles</Label>

        {roles.map((role) => {
    const isChecked = selectedRoles?.includes(role.id);

    return (
      <label key={role.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            if (e.target.checked) {
              setValue("roles_ids", [...(selectedRoles ?? []), role.id]);
            } else {
              setValue(
                "roles_ids",
                (selectedRoles ?? []).filter((id) => id !== role.id)
              );
            }
          }}
        />
        <span>{role.name}</span>
      </label>
    );
  })}
      </div>

      {/* ===================== ACTIVE ===================== */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={watch("isActive")}
          onCheckedChange={(v) => setValue("isActive", Boolean(v))}
        />
        <span>Active</span>
      </div>

      <Button disabled={status === "loading"} className="w-full">
        Update Admin
      </Button>
    </form>
  );
}