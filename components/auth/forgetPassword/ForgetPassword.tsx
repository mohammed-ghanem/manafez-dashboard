"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent } from "react";
import { useSendResetCodeMutation } from "@/store/auth/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useRouter } from "next/navigation";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import forgetPass from "@/public/assets/images/forgetPass.svg";
import ForgetPasswordSkeleton from "./ForgetPasswordSkeleton";

const ForgetPassword = () => {
  const [sendResetCode, { isLoading }] = useSendResetCodeMutation();

  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await sendResetCode({ email }).unwrap();

      toast.success(res?.message);

      router.push(
        `/${lang}/verify-code?email=${encodeURIComponent(email)}`
      );
    } catch (err: any) {
      const errorData = err?.data ?? err;
      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          }
        });
        return;
      }

      // Generic backend message
      if (errorData?.message) {toast.error(errorData.message);
        return;
      }
    }
  };

  if (!translate) {
    return <ForgetPasswordSkeleton />;
  }

  return (
    <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form */}
        <div className="my-10" style={{ direction: "ltr" }}>
          <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
            {translate?.pages.forgetPassword?.title}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative"
          >
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${
                  lang === "en" ? "text-start" : "text-end"
                }`}
              >
                {translate?.pages.forgetPassword?.email}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bkMainColor text-white font-bold py-3 px-4 mt-5 rounded-lg flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {translate?.pages.forgetPassword?.sending} ...
                  </>
                ) : (
                  translate?.pages.forgetPassword?.send)}
              </button>
            </div>
          </form>
        </div>

        {/* Image */}
        <div className="relative lg:block">
          <Image
            src={whiteAuthBk}
            className="w-full"
            height={100}
            alt="auth background"
          />
          <Image
            src={forgetPass}
            fill
            className="max-w-[70%] max-h-[50%] m-auto"
            alt="forget password illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;