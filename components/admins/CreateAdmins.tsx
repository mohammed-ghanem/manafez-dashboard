"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions/ActFetchRoles";
import { ActCreateAdmin } from "@/store/admins/thunkActions/ActCreateAdmins";
import { toast } from "sonner";

import { User, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type FormState = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  password_confirmation: string;
  role_id: number[]; 
  is_active: boolean;
};

export default function CreateAdmins() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { roles, status } = useAppSelector((state) => state.roles);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    password_confirmation: "",
    role_id: [],
    is_active: true,
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(ActFetchRoles());
    }
  }, [dispatch, status]);

  /** ✅ Checkbox handler */
  const toggleRole = (roleId: number) => {
    setForm((prev) => ({
      ...prev,
      role_id: prev.role_id.includes(roleId)
        ? prev.role_id.filter((id) => id !== roleId)
        : [...prev.role_id, roleId],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await dispatch(ActCreateAdmin(form)).unwrap();

            // ✅ success message from backend (fallback if missing)
      toast.success(res?.message || "admin created successfully");



      router.push("/admins");
    } catch (err: any) {
      const errors = err?.errors as Record<string, string[] | string> | undefined;

      if (errors) {
        Object.values(errors).forEach((value) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => toast.error(msg));
          } else {
            toast.error(value);
          }
        });
        return;
      }

      if (typeof err?.message === "string") {
        toast.error(err.message);
        return;
      }

      toast.error("Create role failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md space-y-4 bg-white p-6 rounded-xl shadow mx-auto"
      dir="ltr"
    >
      {/* Name */}
      <div className="relative">
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className="w-full border pl-9 p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className="w-full border pl-9 p-2 rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          
        />
      </div>

      {/* Phone */}
      <PhoneInput
        country={"eg"}
        value={form.mobile}
        onChange={(phone) =>
          setForm({ ...form, mobile: phone })
        }
        inputClass="!w-full !pl-12 !py-2 !border !rounded"
        containerClass="!w-full"
      />

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className="w-full border pl-9 p-2 rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          
        />
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className="w-full border pl-9 p-2 rounded"
          type="password"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={(e) =>
            setForm({
              ...form,
              password_confirmation: e.target.value,
            })
          }
          
        />
      </div>

      {/* ✅ Roles (CHECKBOXES) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-gray-400" />
          Roles
        </div>

        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-center gap-2 border rounded p-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.role_id.includes(role.id)}
                onChange={() => toggleRole(role.id)}
              />
              <span>{role.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) =>
            setForm({
              ...form,
              is_active: e.target.checked,
            })
          }
        />
        Active
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-black text-white p-2 rounded disabled:opacity-60"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </span>
        ) : (
          "Create Admin"
        )}
      </button>
    </form>
  );
}