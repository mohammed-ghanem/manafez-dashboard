/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  useCreateAdminMutation,
  useGetAdminsQuery 
} from "@/store/admins/adminsApi";
import { useGetRolesQuery } from "@/store/roles/rolesApi";
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

export default function CreateAdmin() {
  const router = useRouter();

  /* ===================== RTK QUERIES ===================== */
  // جلب قائمة الأدمن (للتأكد من invalidateTags)
  const { refetch } = useGetAdminsQuery();
  
  // جلب الأدوار باستخدام RTK Query
  const { 
    data: rolesResponse, 
    isLoading: rolesLoading, 
    isError: rolesError 
  } = useGetRolesQuery();
  
  const roles = rolesResponse || [];

  // دالة إنشاء الأدمن باستخدام RTK Query
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  /* ===================== FORM STATE ===================== */
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    password_confirmation: "",
    role_id: [],
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  /* ===================== HANDLERS ===================== */
  const toggleRole = (roleId: number) => {
    setForm((prev) => ({
      ...prev,
      role_id: prev.role_id.includes(roleId)
        ? prev.role_id.filter((id) => id !== roleId)
        : [...prev.role_id, roleId],
    }));
    
    // مسح أخطاء roles عند التعديل
    if (errors.role_id) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.role_id;
        return newErrors;
      });
    }
  };

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // مسح أخطاء الحقل عند التعديل
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /* ===================== SUBMIT ===================== */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // تحقق من كلمة المرور
    if (form.password !== form.password_confirmation) {
      toast.error("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    // تحقق من اختيار دور واحد على الأقل
    if (form.role_id.length === 0) {
      toast.error("يجب اختيار دور واحد على الأقل");
      return;
    }

    try {
      // إرسال البيانات باستخدام RTK Query
      const res = await createAdmin({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        password_confirmation: form.password_confirmation,
        role_id: form.role_id,
        is_active: form.is_active,
      }).unwrap();

      toast.success(res.message || "✅ تم إنشاء المسؤول بنجاح");

      // إعادة تحميل قائمة الأدمن (سيتم تلقائياً بسبب invalidateTags)
      await refetch();

      // التوجيه إلى صفحة الأدمن
      router.push("/admins");
    } catch (err: any) {
      console.error("Create admin error:", err);
      
      if (err?.status === 422 && err?.errors) {
        // حفظ الأخطاء للعرض في الحقول
        setErrors(err.errors);
        
        // عرض الأخطاء في Toast
        Object.values(err.errors).forEach((value: any) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => toast.error(msg));
          } else {
            toast.error(value);
          }
        });
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("حدث خطأ غير متوقع أثناء إنشاء المسؤول");
      }
    }
  };

  /* ===================== LOADING STATES ===================== */
  if (rolesLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        ❌ فشل في تحميل الأدوار. يرجى المحاولة مرة أخرى.
      </div>
    );
  }

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
          className={`w-full border pl-9 p-2 rounded ${
            errors.name ? "border-red-500" : ""
          }`}
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className={`w-full border pl-9 p-2 rounded ${
            errors.email ? "border-red-500" : ""
          }`}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div className="relative">
        <PhoneInput
          country={"eg"}
          value={form.mobile}
          onChange={(phone) => handleInputChange("mobile", phone)}
          inputClass={`!w-full !pl-12 !py-2 !border !rounded ${
            errors.mobile ? "!border-red-500" : ""
          }`}
          containerClass="!w-full"
        />
        {errors.mobile && (
          <p className="text-red-500 text-sm mt-1">{errors.mobile[0]}</p>
        )}
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className={`w-full border pl-9 p-2 rounded ${
            errors.password ? "border-red-500" : ""
          }`}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className={`w-full border pl-9 p-2 rounded ${
            errors.password_confirmation ? "border-red-500" : ""
          }`}
          type="password"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
        />
        {errors.password_confirmation && (
          <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
        )}
      </div>

      {/* Roles */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-gray-400" />
          Roles
        </div>

        {errors.role_id && (
          <p className="text-red-500 text-sm">{errors.role_id[0]}</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          {roles.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد أدوار متاحة</p>
          ) : (
            roles.map((role) => (
              <label
                key={role.id}
                className={`flex items-center gap-2 border rounded p-2 cursor-pointer ${
                  form.role_id.includes(role.id) ? "bg-blue-50 border-blue-300" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.role_id.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{role.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Active */}
      <label className="flex items-center gap-2 p-2 border rounded">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => handleInputChange("is_active", e.target.checked)}
          className="accent-blue-600"
        />
        <span>Active</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isCreating}
        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            جاري الإنشاء...
          </span>
        ) : (
          "Create Admin"
        )}
      </button>
    </form>
  );
}