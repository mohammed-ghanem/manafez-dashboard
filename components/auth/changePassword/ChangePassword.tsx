"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActChangePassword } from "@/store/auth/thunkActions/ActAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import changePass from "@/public/assets/images/changePass.svg";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const lang = LangUseParams();
  const translate = TranslateHook();

  const [form, setForm] = useState({
    old_password: "",
    password: "", 
    password_confirmation: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (form.password !== form.password_confirmation) {
  //     toast.error(
  //       translate?.pages.changePassword.notMatch ||
  //         "New password and confirmation do not match"
  //     );
  //     return;
  //   }

  //   const result = await dispatch(ActChangePassword(form));

  //   if (ActChangePassword.fulfilled.match(result)) {
  //     toast.success(
  //       result.payload?.message ||
  //         translate?.pages.changePassword.success ||
  //         "Password updated successfully"
  //     );
  //       setForm({ old_password: "", password: "", password_confirmation: "" });
  //       setTimeout(() => {
  //       window.location.href = `/${lang}/`;
  //     }, 1000);
  //   } else {
  //     toast.error(result.payload as string); 
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (form.password !== form.password_confirmation) {
      toast.error(
        translate?.pages.changePassword.notMatch ||
          "New password and confirmation do not match"
      );
      return;
    }
  
    try {
      const res = await dispatch(ActChangePassword(form)).unwrap();
  
      // ✅ success message from backend
      toast.success(
        res?.message ||
          translate?.pages.changePassword.success ||
          "Password updated successfully"
      );
  
      setForm({ old_password: "", password: "", password_confirmation: "" });
  
      setTimeout(() => {
        window.location.href = `/${lang}/`;
      }, 1000);
    } catch (err: any) {
      // ✅ handle validation errors
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
            {translate?.pages.changePassword.title || "Change Password"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative"
          >
            {/* Old password */}
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${
                  lang === "en" ? "text-start" : "text-end"
                }`}
              >
                {translate?.pages.changePassword.oldPassword || "Old Password"}
              </label>
              <input
                type="password"
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none"
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* New password */}
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${
                  lang === "en" ? "text-start" : "text-end"
                }`}
              >
                {translate?.pages.changePassword.password || "New Password"}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none"
              />
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${
                  lang === "en" ? "text-start" : "text-end"
                }`}
              >
                {translate?.pages.changePassword.confirmPassword || "Confirm Password"}
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none"
              />
            </div>

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
                    {translate?.pages.changePassword.processing ||
                      "Processing..."}
                  </>
                ) : (
                  translate?.pages.changePassword.confirmBtn || "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right-side image */}
        <div className="relative lg:block">
          <div>
            <Image
              src={whiteAuthBk}
              className="w-full"
              height={100}
              alt="authsvg"
            />
          </div>
          <Image
            src={changePass}
            fill
            className="max-w-[70%] max-h-[50%] m-auto"
            alt="auth"
          />
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;