"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchProfile } from "@/store/auth/thunkActions/ActUser";
import Link from "next/link";
import { SquarePen, User, Mail, Phone, Loader2 } from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function ProfileDetails() {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  console.log(user);


  useEffect(() => {
    dispatch(ActFetchProfile());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">❌ {error}</p>
            </div>
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
              <p>{translate?.pages.profile.noData || "No profile data found."}</p>
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
          <div className="mx-auto w-16 h-16  from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.name}`}
                width={40}
                height={40}
                className="w-16 h-16 rounded-full object-cover"
              />

            ) : (
              <User className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {user.name}
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            {translate?.pages.profile.title || "Profile Information"}
          </CardDescription>
          {/* <Badge variant="secondary" className="mt-2 mx-auto">
            {translate?.pages.profile.member || "Member"}
          </Badge> */}
          <Badge
            variant="destructive"
            className="mt-2 mx-auto"
          >
            {user.roles}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              {translate?.pages.profile.personalDetails || "Personal Details"}
            </h3>

            {/* Name Field */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium text-gray-500
                                ${lang === "ar" || lang === "" ? 'text-end' : 'text-start'}
                                `}>

                  {translate?.pages.profile.name || "Full Name"}
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
                <p className={`text-sm font-medium text-gray-500
                                ${lang === "ar" || lang === "" ? 'text-end' : 'text-start'}
                                `}>
                  {translate?.pages.profile.email || "Email Address"}
                </p>
                <p className="text-gray-800 font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Phone Field */}
            {user.mobile && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600 " />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium text-gray-500
                                ${lang === "ar" || lang === "" ? 'text-end' : 'text-start'}
                                `}>
                    {translate?.pages.profile.phone || "Phone Number"}
                  </p>
                  <p className="text-gray-800 font-semibold">{user.mobile}</p>
                </div>
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <Button asChild className="w-full bkMainColor text-white">
            <Link href={`/${lang}/update-profile`} className="flex items-center justify-center">
              <SquarePen className="w-4 h-4 mr-2" />
              {translate?.pages.profile.editProfile || "Edit Profile"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileDetails;