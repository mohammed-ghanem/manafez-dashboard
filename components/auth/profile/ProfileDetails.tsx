"use client";

import { useEffect } from "react";
import { useGetProfileQuery } from "@/store/auth/authApi";
import Link from "next/link";
import { SquarePen, User, Mail, Phone, Loader2 } from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";

function ProfileDetails() {
  const lang = LangUseParams();
  const translate = TranslateHook();

  // استخدام RTK Query hook
  const {
    data: profileData,
    isLoading,
    error,
    refetch
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true, // إعادة جلب البيانات عند التركيب
  });

  // استخراج بيانات المستخدم
  const user = profileData?.data || profileData?.user || profileData;

  // التعامل مع الأخطاء
  useEffect(() => {
    if (error) {
      console.error("Profile error:", error);
      toast.error("فشل في تحميل بيانات البروفايل");
    }
  }, [error]);

  // إعادة تحميل البيانات إذا لزم الأمر
  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500">
          {translate?.pages.profile.loading || "جاري تحميل البيانات..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              <p className="font-medium">
                {translate?.pages.profile.error || "حدث خطأ في تحميل البيانات"}
              </p>
            </div>
            <Button onClick={handleRetry} variant="outline">
              {translate?.common.retry || "إعادة المحاولة"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <p>{translate?.pages.profile.noData || "لم يتم العثور على بيانات البروفايل."}</p>
              <Button onClick={handleRetry} variant="link" className="mt-2">
                {translate?.common.refresh || "تحديث"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6" dir="ltr">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3  from-blue-100 to-purple-100">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.name}`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <User className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {user.name}
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            {translate?.pages.profile.title || "معلومات البروفايل"}
          </CardDescription>
          <Badge
            variant="destructive"
            className="mt-2 mx-auto"
          >
            {user.roles || translate?.pages.profile.member || "عضو"}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              {translate?.pages.profile.personalDetails || "التفاصيل الشخصية"}
            </h3>

            {/* Name Field */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium text-gray-500 ${lang === "ar" ? 'text-end' : 'text-start'}`}>
                  {translate?.pages.profile.name || "الاسم الكامل"}
                </p>
                <p className="text-gray-800 font-semibold">{user.name}</p>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 mainColor" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium text-gray-500 ${lang === "ar" ? 'text-end' : 'text-start'}`}>
                  {translate?.pages.profile.email || "البريد الإلكتروني"}
                </p>
                <p className="text-gray-800 font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Phone Field */}
            {user.mobile && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium text-gray-500 ${lang === "ar" ? 'text-end' : 'text-start'}`}>
                    {translate?.pages.profile.phone || "رقم الهاتف"}
                  </p>
                  <p className="text-gray-800 font-semibold">{user.mobile}</p>
                </div>
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <Button asChild className="w-full bkMainColor text-white hover:bkMainColor/90 transition-colors">
            <Link href={`/${lang}/update-profile`} className="flex items-center justify-center">
              <SquarePen className="w-4 h-4 mr-2" />
              {translate?.pages.profile.editProfile || "تعديل البروفايل"}
            </Link>
          </Button>


        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileDetails;