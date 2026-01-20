/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import otp from "@/public/assets/images/otp.svg";
import { useVerifyCodeMutation } from "@/store/auth/authApi";
import LangUseParams from "@/translate/LangUseParams";

const VerifyCode = () => {
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();
  const router = useRouter();
  const search = useSearchParams();
  const lang = LangUseParams();

  const email = search.get("email") ?? "";
  const [code, setCode] = useState("");

  // احفظ email في cookies للاستخدام لاحقاً
  useEffect(() => {
    if (email) {
      Cookies.set("reset_email", email, { expires: 1 });
    }
  }, [email]);

  // Auto redirect if email is missing
  useEffect(() => {
    if (!email) {
      router.replace(`/${lang}/forget-password`);
    }
  }, [email, router , lang]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await verifyCode({ code }).unwrap();

      toast.success(
        res?.message || "تم التحقق من الرمز بنجاح"
      );

      // انتقل إلى صفحة إعادة تعيين كلمة المرور
      router.push(
        `/${lang}/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`
      );
    } catch (err: any) {
      const errorData = err?.data ?? err;

      // Laravel validation errors 
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) => {
          messages.forEach((msg: string) => toast.error(msg));
        });
        return;
      }

      // Generic backend message
      if (errorData?.message) {
        toast.error(errorData.message);
        return;
      }
    }
  };


  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form */}
        <div className="my-10" style={{ direction: "ltr" }}>
          <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
            التحقق من الرمز
          </h1>

          <form onSubmit={handleSubmit} className="p-4 w-[95%] md:w-[80%] mx-auto">
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 mainColor">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 border bg-gray-50 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 mainColor">
                رمز التحقق (1111)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="أدخل الرمز 1111"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center transition-colors disabled:opacity-50 mb-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                "تأكيد الرمز"
              )}
            </button>


            <div className="mt-4 text-center text-sm text-gray-600">
              <button
                type="button"
                onClick={() => router.push(`/${lang}/forget-password?email=${email}`)}
                className="text-blue-600 hover:text-blue-800"
              >
                لم تستلم الرمز؟ أعد إرساله
              </button>
            </div>
          </form>
        </div>

        {/* Image */}
        <div className="relative lg:block hidden">
          <Image src={whiteAuthBk} className="w-full" alt="auth background" />
          <Image
            src={otp}
            fill
            className="max-w-[70%] max-h-[50%] m-auto"
            alt="OTP verification"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;