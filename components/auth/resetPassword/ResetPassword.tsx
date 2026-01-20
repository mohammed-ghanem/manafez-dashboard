/* app/[lang]/reset-password/page.tsx */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent, useEffect } from "react";
import { useResetPasswordMutation } from "@/store/auth/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import restpass from "@/public/assets/images/restpass.svg";

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();
  const search = useSearchParams();

  const email = search.get("email") ?? "";
  const code = search.get("code") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  /**
   * 🔴 Protect direct access
   */
  useEffect(() => {
    if (!email || !code) {
      router.replace(`/${lang}/forget-password`);
    }
  }, [email, code, lang, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error(
        translate?.pages.resetPassword?.passwordMismatch ||
          "Passwords do not match"
      );
      return;
    }

    try {
      const res = await resetPassword({
        email,
        code,
        password,
        password_confirmation: confirm,
      }).unwrap();

      toast.success(
        res?.message ||
          translate?.pages.resetPassword?.success ||
          "Password reset successful"
      );

      router.replace(`/${lang}/login`);
    } catch (err: any) {
      const errorData = err?.data ?? err;

      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((msgs: any) =>
          Array.isArray(msgs) && msgs.forEach((m) => toast.error(m))
        );
        return;
      }

      if (errorData?.message) {
        toast.error(errorData.message);
        return;
      }

      toast.error("Reset failed");
    }
  };

  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        <div className="my-10" style={{ direction: "ltr" }}>
          <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
            {translate?.pages.resetPassword?.title || "Reset Password"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto"
          >
            {[
              { label: "password", value: password, set: setPassword },
              { label: "confirmPassword", value: confirm, set: setConfirm },
            ].map((f, i) => (
              <div key={i} className="mb-4">
                <label className="block text-sm font-bold mainColor">
                  {translate?.pages.resetPassword?.[f.label] || f.label}
                </label>
                <input
                  type="password"
                  required
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="mt-1 block w-full p-2 border bg-white rounded-md"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bkMainColor text-white font-bold py-3 mt-5 rounded-lg flex justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {translate?.pages.resetPassword?.processing || "Processing"}
                </>
              ) : (
                translate?.pages.resetPassword?.confirmBtn ||
                "Reset Password"
              )}
            </button>
          </form>
        </div>

        <div className="relative lg:block">
          <Image src={whiteAuthBk} className="w-full" alt="auth" />
          <Image
            src={restpass}
            fill
            className="max-w-[70%] max-h-[50%] m-auto"
            alt="reset"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;