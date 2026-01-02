/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActLogin } from "@/store/auth/thunkActions/ActAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import loginIcon from "@/public/assets/images/loginIcon.svg";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";

const Login = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const lang = LangUseParams();
  const translate = TranslateHook();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const res = await dispatch(ActLogin(form)).unwrap();
      // ✅ backend success message
      toast.success(
        <span className="font-cairo font-bold">
          {res?.message ||
            translate?.pages.login.success || "Login successful"}
        </span>
      );
  
      setTimeout(() => {
        window.location.href = `/${lang}/`;
      }, 1000);
    } catch (err: any) {
      // ✅ validation errors
      if (err?.errors) {
        Object.values(err.errors).forEach((value: any) => {
          if (Array.isArray(value)) {
            value.forEach((msg) => toast.error(msg));
          } else {
            toast.error(value);
          }
        });
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
            {translate?.pages.login.loginTitle || "Login"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative"
          >
            {/* Email */}
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"
                  }`}
              >
                {translate?.pages.login.email || "Email"}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border bg-white
                 border-gray-300 rounded-md shadow-sm outline-none"
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"
                  }`}
              >
                {translate?.pages.login.passwordName || "Password"}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border bg-white
                 border-gray-300 rounded-md shadow-sm outline-none"
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Forget password */}
            <a
              href={`/${lang}/forget-password`}
              className="border-b border-regal-blue"
            >
              {translate?.pages.login.forgetPassword || "Forgot password?"}
            </a>
 
            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bkMainColor text-white font-bold
                 py-3 px-4 mt-5 rounded-lg flex justify-center items-center cursor-pointer"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {translate?.pages.login.processing || "Processing..."}
                  </>
                ) : (
                  translate?.pages.login.loginButton || "Login"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right-side image */}
        <div className="relative lg:block">
          <div>
            <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
          </div>
          <Image
            src={loginIcon}
            fill
            className="max-w-[70%] max-h-[50%] m-auto"
            alt="loginauth"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;