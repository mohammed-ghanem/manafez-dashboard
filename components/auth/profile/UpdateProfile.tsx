/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/store/auth/authApi";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import "react-phone-input-2/lib/style.css";
import "./style.css";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import { useRouter } from "next/navigation";

function UpdateProfile() {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  // استخدام RTK Query hooks
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // استخراج بيانات المستخدم
  const user = profileData?.data || profileData?.user || profileData;

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [initialLoading, setInitialLoading] = useState(true);

  /* hydrate form عند تحميل بيانات المستخدم */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
      });
      setInitialLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (value: string) => {
    setForm((prev) => ({ ...prev, mobile: `+${value}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUpdating) return;

    // التحقق من صحة البيانات
    if (!form.name.trim()) {
      toast.error(translate?.pages.updateProfile.nameRequired || "الاسم مطلوب");
      return;
    }

    try {
      // إرسال طلب التحديث
      const res = await updateProfile({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
      }).unwrap();

      // عرض رسالة النجاح
      toast.success(
        res?.message ||
        translate?.pages.updateProfile.success ||
        "تم تحديث البروفايل بنجاح"
      );

      // إعادة تحميل بيانات البروفايل
      await refetch();

      // الانتقال إلى صفحة البروفايل بعد 1.5 ثانية
      setTimeout(() => {
        router.push(`/${lang}/profile`);
      }, 1500);

    } catch (err: any) {
      console.error("Update profile error:", err);

      // التعامل مع الأخطاء المختلفة
      if (err?.data?.errors) {
        // أخطاء التحقق من الصحة
        Object.values(err.data.errors).forEach((v: any) =>
          Array.isArray(v)
            ? v.forEach((m) => toast.error(m))
            : toast.error(v)
        );
      } else if (err?.data?.message) {
        // رسالة خطأ من الخادم
        toast.error(err.data.message);
      } else if (err?.error) {
        // خطأ من RTK Query
        toast.error(err.error);
      } else {
        // خطأ عام
        toast.error(
          translate?.pages.updateProfile.error || "فشل في تحديث البروفايل"
        );
      }
    }
  };

  if (initialLoading || isLoadingProfile) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500">
          {translate?.pages.updateProfile.loading || "جاري تحميل البيانات..."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6" dir="ltr">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold">
            {translate?.pages.updateProfile.title || "تحديث البروفايل"}
          </CardTitle>
          <CardDescription>
            {translate?.pages.updateProfile.titleUpdate || "قم بتحديث معلوماتك الشخصية"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                {translate?.pages.updateProfile.name || "الاسم"} *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  placeholder={translate?.pages.updateProfile.namePlaceholder || "أدخل اسمك"}
                />
              </div>
            </div>

            {/* Email (مقروء فقط) */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {translate?.pages.updateProfile.email || "البريد الإلكتروني"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="pl-10 bg-gray-50"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">
                {translate?.pages.updateProfile.emailNote || "لا يمكن تغيير البريد الإلكتروني"}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                {translate?.pages.updateProfile.phone || "رقم الهاتف"}
              </Label>
              <PhoneInput
                country="eg"
                value={form.mobile.replace("+", "")}
                onChange={handlePhoneChange}
                inputClass="!w-full !h-10 !pl-12"
                containerClass="!w-full"
                inputProps={{
                  id: "phone",
                  name: "mobile",
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isUpdating}
                className="flex-1 text-white bkMainColor hover:bkMainColor/90"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {translate?.pages.updateProfile.processing || "جاري المعالجة..."}
                  </>
                ) : (
                  translate?.pages.updateProfile.confirmBtn || "تأكيد التحديث"
                )}
              </Button>


            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateProfile;