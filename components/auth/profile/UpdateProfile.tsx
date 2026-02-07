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
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

function UpdateProfile() {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const user = profileData?.data || profileData?.user || profileData;
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [initialLoading, setInitialLoading] = useState(true);

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

   
    if (!form.name.trim()) {
      toast.error(translate?.pages.updateProfile.nameRequired);
      return;
    }

    try {
      const res = await updateProfile({name: form.name,email: form.email,mobile: form.mobile,}).unwrap();
      toast.success(res?.message);

      await refetch();
      router.push(`/${lang}/profile`);

    } catch (err: any) {
      const errorData = err?.data ?? err;

      if (errorData?.errors) { 
        Object.values(errorData.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg))
        );
        return;
      }

      if (errorData?.message) {toast.error(errorData.message);
        return;
      }
    }
  };

  if (isLoadingProfile) return <ProfileSkeleton />;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6" dir="ltr">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold">
            {translate?.pages.updateProfile.title}
          </CardTitle>
          <CardDescription>
            {translate?.pages.updateProfile.titleUpdate}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className={`block ${lang === "ar" ? "text-right!" : "text-left"}`}>
                {translate?.pages.updateProfile.name}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="pl-10 focus-visible:ring-0! border-gray-300!"
                  required
                  placeholder={translate?.pages.updateProfile.namePlaceholder}
                />
              </div>
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`block ${lang === "ar" ? "text-right!" : "text-left"}`}>
                {translate?.pages.updateProfile.email}
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
                {translate?.pages.updateProfile.emailNote}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className={`block ${lang === "ar" ? "text-right!" : "text-left"}`}>
                {translate?.pages.updateProfile.phone}
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
                className="flex items-center w-fit m-auto font-semibold rounded-xl greenBgIcon"
                >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {translate?.pages.updateProfile.processing} ...
                  </>
                ) : (
                  translate?.pages.updateProfile.confirmBtn
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