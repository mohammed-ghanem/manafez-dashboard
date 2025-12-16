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

type EditAdminForm = {
    name: string;
    email: string;
    phone: string;
    roleIds: number[];
    isActive: boolean;
  };
  

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
      roleIds: [],
      isActive: true,
    },
  });

  // Fetch data
  useEffect(() => {
    dispatch(ActFetchRoles());
    dispatch(ActFetchAdminById(Number(id)));
  }, [dispatch, id]);

  // Fill form when admin loads
  useEffect(() => {
    if (!selected) return;
  
    reset({
      name: selected.name,
      email: selected.email,
      phone: selected.mobile,
      roleIds: selected.roles_ids.map(r => r.id), // 👈 KEY LINE
      isActive: selected.is_active,
    });
  }, [selected, reset]);
  
  

  const onSubmit = async (data: EditAdminForm) => {
    await dispatch(
        ActUpdateAdmin({
          id: Number(id),
          data: {
            name: data.name,
            email: data.email,
            mobile: data.phone,
            role_ids: data.roleIds, // ✅ matches API
            is_active: data.isActive ? 1 : 0,
          },
        })
      ).unwrap();

    router.push("/admins");
  };

  const selectedRoles = watch("roleIds");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-4 p-6"
    >
      <Input placeholder="Name" {...register("name", { required: true })} />
      <Input placeholder="Email" {...register("email", { required: true })} />
      <Input placeholder="Phone" {...register("phone")} />

      {/* Roles */}
      <div className="space-y-2">
        <Label>Roles</Label>
        {roles.map((role) => (
            <label key={role.id} className="flex items-center gap-2">
                <input
                type="checkbox"
                value={role.id}
                {...register("roleIds")}
                checked={watch("roleIds")?.includes(role.id)}
                onChange={(e) => {
                    const current = watch("roleIds") || [];
                    const value = Number(e.target.value);

                    if (e.target.checked) {
                    setValue("roleIds", [...current, value]);
                    } else {
                    setValue(
                        "roleIds",
                        current.filter((id) => id !== value)
                    );
                    }
                }}
            />
    <span>{role.name}</span>
  </label>
))}


      </div>

      {/* Active */}
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
