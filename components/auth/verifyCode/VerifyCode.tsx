/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

import whiteAuthBk from "@/public/assets/images/Vector.svg";
import otp from "@/public/assets/images/otp.svg";

import { useVerifyCodeMutation } from "@/store/auth/authApi";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import VerifyCodeSkeleton from "./VerifyCodeSkeleton";

const CODE_LENGTH = 4;

const VerifyCode = () => {
  const [verifyCode, { isLoading }] = useVerifyCodeMutation();
  const router = useRouter();
  const search = useSearchParams();
  const lang = LangUseParams();
  const translate = TranslateHook();

  const email = search.get("email") ?? "";

  const [code, setCode] = useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  /*save email in cookie*/
  useEffect(() => {
    if (email) {
      Cookies.set("reset_email", email, { expires: 1 });
    }
  }, [email]);

  /* cant login if no email */
  useEffect(() => {
    if (!email) {
      router.replace(`/${lang}/forget-password`);
    }
  }, [email, router, lang]);

  /* enter number in input */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  /* Backspace in last input */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* Paste code */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);

    if (!pasted) return;

    const newCode = pasted.split("");
    while (newCode.length < CODE_LENGTH) newCode.push("");

    setCode(newCode);

    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const finalCode = code.join("");

    // if (finalCode.length !== CODE_LENGTH) {
    //   toast.error("من فضلك أدخل كود التحقق كامل");
    //   return;
    // }

    try {
      const res = await verifyCode({ code: finalCode }).unwrap();
      toast.success(res?.message);

      router.push(
        `/${lang}/reset-password?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(finalCode)}`
      );
    } catch (err: any) {
      const errorData = err?.data ?? err;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) => {
          messages.forEach((msg: string) => toast.error(msg));
        });
      }
    }
  };

  if (!translate || !email) {
    return <VerifyCodeSkeleton />;
  }
  

  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form */}
        <div className="my-10" style={{ direction: "ltr" }}>
          <h1 className="text-center font-bold text-xl mainColor">
            {translate?.pages.verifyCode.title}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto"
          >
            {/* Email */}
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 mainColor 
              ${lang === "ar" ? "text-right!" : "text-left"}
              `}>
                {translate?.pages.verifyCode.email}
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 border bg-gray-50 rounded-md"
              />
            </div>

            {/* OTP */}
            <div className="mb-6">
            <label className={`block text-sm font-bold mb-2 mainColor 
              ${lang === "ar" ? "text-right!" : "text-left"}
              `}>
                {translate?.pages.verifyCode.code}
              </label>

              <div className="flex gap-3 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {inputsRef.current[index] = el}}                    
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, index)
                    }
                    onPaste={handlePaste}
                    className="w-14 h-14 text-center text-xl font-bold border rounded-md ring-2 ring-blue-500"
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-fit greenBgIcon
               text-white font-bold py-3 px-28! m-auto rounded-lg flex justify-center
                items-center transition-colors disabled:opacity-50 mb-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {translate?.pages.verifyCode.processing} ...
                </>
              ) : (
                translate?.pages.verifyCode.verify
              )}
            </button>

            {/* Resend */}
            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/${lang}/forget-password?email=${email}`
                  )
                }
                className="createBtn mt-5 font-semibold"
              >
                {translate?.pages.verifyCode.resendCode}
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