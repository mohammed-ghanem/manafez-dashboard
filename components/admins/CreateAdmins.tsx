"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions/ActFetchRoles";
import { ActCreateAdmin } from "@/store/admins/thunkActions/ActCreateAdmins";
import "../auth/profile/style.css";
import { toast } from "sonner";

import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../auth/profile/style.css";

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

  const { roles, status: adminStatus  } = useAppSelector(
    (state) => state.roles
  );


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
    if (adminStatus === "idle") {
      dispatch(ActFetchRoles());
    }
  }, [dispatch, adminStatus]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(ActCreateAdmin(form)).unwrap();

      toast.success("Admin created successfully");
      router.push("/admins");
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        "Failed to create admin";

      toast.error(message);
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
          required
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
          required
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
          required
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
          required
        />
      </div>

      {/* Role */}
      <div className="relative">
        <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <select
          className="w-full border pl-9 p-2 rounded"
          required
          onChange={(e) =>
            setForm({
              ...form,
              role_id: [Number(e.target.value)],
            })
          }
        >
          <option value="">Select role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
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
        disabled={adminStatus  === "loading"}
        className="w-full bg-black text-white p-2 rounded disabled:opacity-60"
      >
        {adminStatus  === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    "Processing..."
                  </>
                ) : (
                    "Create Admin"
                )}
      </button>
    </form>
  );
}