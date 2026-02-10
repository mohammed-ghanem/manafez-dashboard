/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useLoginMutation } from "@/store/auth/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// import Image from "next/image";
import { useRouter } from "next/navigation";

// import whiteAuthBk from "@/public/assets/images/Vector.svg";
// import loginIcon from "@/public/assets/images/loginIcon.svg";

import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import LoginSkeleton from "./LoginSkeleton";


import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Login = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const lang = LangUseParams();
  const translate = TranslateHook();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!translate) {
    return <LoginSkeleton />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await login(form).unwrap();
      toast.success(res?.message);
      router.replace(`/${lang}`);
    } catch (err: any) {
      const errorData = err?.data ?? err;

      if (errorData?.errors) {
        Object.values(errorData.errors).forEach((messages: any) =>
          messages.forEach((msg: string) => toast.error(msg))
        );
        return;
      }

      if (errorData?.message) {
        toast.error(errorData.message);
      }
    }
  };

  return (
    <div className="relative grdianBK font-cairo" dir="rtl">
      <div className="grid lg:grid-cols-2 gap-4 items-center">
        {/* Form */}
        <div className="my-10" dir="ltr">
          <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
            {translate.pages.login.loginTitle}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto"
          >
            <div className="mb-4">
              <label className="block text-sm font-bold mainColor">
                {translate.pages.login.email}
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mainColor">
                {translate.pages.login.passwordName}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>

            <a
              href={`/${lang}/forget-password`}
              className="border-b border-regal-blue"
            >
              {translate.pages.login.forgetPassword}
            </a>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bkMainColor text-white py-3 mt-5 rounded-lg flex justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {translate.pages.login.processing}
                </>
              ) : (
                translate.pages.login.loginButton
              )}
            </button>
          </form>
        </div>

        {/* Image */}

        <div className="relative hidden lg:flex bkMainColor h-screen items-center justify-center">
          <div className="h-[40%]">
            <DotLottieReact
              src="https://lottie.host/af844b7c-04d0-415a-a2be-c6f391ee4678/KFCQAqD3p1.lottie"
              loop
              autoplay
              className=""
            />
          </div>
        </div>





      </div>
    </div>
  );
};

export default Login;