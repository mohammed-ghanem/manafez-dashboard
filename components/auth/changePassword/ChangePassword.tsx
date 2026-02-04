/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useChangePasswordMutation } from "@/store/auth/authApi";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ChangePasswordSkeleton from "./ChangePasswordSkeleton";


const ChangePassword = () => {
  const router = useRouter();
  const lang = LangUseParams();
  const translate = TranslateHook();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [form, setForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = (key: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!form.old_password.trim()) {
      errors.push(
        translate?.pages.changePassword.oldRequired ||
          "كلمة المرور الحالية مطلوبة"
      );
    }

    if (!form.password.trim()) {
      errors.push(
        translate?.pages.changePassword.newRequired ||
          "كلمة المرور الجديدة مطلوبة"
      );
    } else if (form.password.length < 8) {
      errors.push(
        translate?.pages.changePassword.minLength ||
          "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
      );
    }

    if (form.password !== form.password_confirmation) {
      errors.push(
        translate?.pages.changePassword.notMatch ||
          "كلمتا المرور غير متطابقتين"
      );
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length) {
      errors.forEach(err => toast.error(err));
      return;
    }

    try {
      const res = await changePassword(form).unwrap();

      toast.success(
        res?.message ||
          translate?.pages.changePassword.success ||
          "تم تغيير كلمة المرور بنجاح"
      );

      setForm({
        old_password: "",
        password: "",
        password_confirmation: "",
      });

      setTimeout(() => {
        router.push(`/${lang}`);
      }, 1500);
    } catch (err: any) {
      if (err?.data?.errors) {
        Object.values(err.data.errors).forEach((value: any) => {
          Array.isArray(value)
            ? value.forEach((msg: string) => toast.error(msg))
            : toast.error(value);
        });
        return;
      }
    }
  };

  if (!translate) {
    return <ChangePasswordSkeleton />;
  }

  return (
    <div className=" flex items-center justify-center bg-muted/40 px-4" dir="ltr">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {translate?.pages.changePassword.title}
          </CardTitle>
          <CardDescription>
            {translate?.pages.changePassword.subtitle}
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div className="space-y-2">
              <Label dir={`${ lang === "ar" ? "rtl" : "ltr"}`}>
                {translate?.pages.changePassword.oldPassword}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword.old ? "text" : "password"}
                  name="old_password"
                  value={form.old_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("old")}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                >
                  {showPassword.old ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label dir={`${ lang === "ar" ? "rtl" : "ltr"}`}>
                {translate?.pages.changePassword.password}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword.new ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                >
                  {showPassword.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground" dir={`${ lang === "ar" ? "rtl" : "ltr"}`}>
                {translate?.pages.changePassword.passCondition}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label dir={`${ lang === "ar" ? "rtl" : "ltr"}`}>
                {translate?.pages.changePassword.confirmPassword}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end justify-center! items-center! space-x-3 my-2">
            <Button
                type="submit"
                className=" greenBgIcon p-5!"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {translate?.pages.changePassword.confirmBtn}
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="hover:bg-red-600 cursor-pointer p-5!"
                onClick={() => router.push(`/${lang}`)}
              >
                {translate?.pages.changePassword.cancelBtn}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;



















// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, ChangeEvent, FormEvent } from "react";
// import { useChangePasswordMutation } from "@/store/auth/authApi";
// import { toast } from "sonner";
// import { Loader2, Eye, EyeOff } from "lucide-react";
// import Image from "next/image";
// import changePass from "@/public/assets/images/changePass.svg";
// import TranslateHook from "@/translate/TranslateHook";
// import LangUseParams from "@/translate/LangUseParams";
// import { useRouter } from "next/navigation";

// const ChangePassword = () => {
//   const router = useRouter(); 
//   const lang = LangUseParams();
//   const translate = TranslateHook();

//   // استخدام RTK Query mutation hook
//   const [changePassword, { isLoading }] = useChangePasswordMutation();

//   const [form, setForm] = useState({
//     old_password: "",
//     password: "",
//     password_confirmation: "",
//   });

//   const [showPassword, setShowPassword] = useState({
//     old: false,
//     new: false,
//     confirm: false,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const togglePasswordVisibility = (field: keyof typeof showPassword) => {
//     setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
//   };

//   const validateForm = (): { isValid: boolean; errors: string[] } => {
//     const errors: string[] = [];

//     // التحقق من كلمة المرور القديمة
//     if (!form.old_password.trim()) {
//       errors.push(
//         translate?.pages.changePassword.oldRequired || "كلمة المرور القديمة مطلوبة"
//       );
//     }

//     // التحقق من كلمة المرور الجديدة
//     if (!form.password.trim()) {
//       errors.push(
//         translate?.pages.changePassword.newRequired || "كلمة المرور الجديدة مطلوبة"
//       );
//     } else if (form.password.length < 8) {
//       errors.push(
//         translate?.pages.changePassword.minLength || "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
//       );
//     }

//     // التحقق من التطابق
//     if (form.password !== form.password_confirmation) {
//       errors.push(
//         translate?.pages.changePassword.notMatch ||
//         "كلمة المرور الجديدة وتأكيدها غير متطابقتين"
//       );
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//     };
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // التحقق من صحة البيانات
//     const validation = validateForm();
//     if (!validation.isValid) {
//       validation.errors.forEach(error => toast.error(error));
//       return;
//     }

//     try {
//       // إرسال طلب تغيير كلمة المرور باستخدام RTK Query
//       const res = await changePassword(form).unwrap();

//       // عرض رسالة النجاح
//       toast.success(
//         res?.message ||
//         translate?.pages.changePassword.success ||
//         "تم تغيير كلمة المرور بنجاح"
//       );

//       // إعادة تعيين النموذج
//       setForm({
//         old_password: "",
//         password: "",
//         password_confirmation: "",
//       });

//       // الانتقال للصفحة الرئيسية بعد تأخير
//       setTimeout(() => {
//         router.push(`/${lang}`);
//       }, 1500);

//     } catch (err: any) {
//       console.error("Change password error:", err);

//       // التعامل مع أخطاء التحقق من الصحة من الخادم
//       if (err?.data?.errors) {
//         Object.values(err.data.errors).forEach((value: any) => {
//           if (Array.isArray(value)) {
//             value.forEach((msg: string) => toast.error(msg));
//           } else {
//             toast.error(value);
//           }
//         });
//         return;
//       }

//       // التعامل مع رسالة الخطأ العامة
//       if (err?.data?.message) {
//         toast.error(err.data.message);
//       } else if (err?.error) {
//         toast.error(err.error);
//       } else {
//         toast.error(
//           translate?.pages.changePassword.error ||
//           "حدث خطأ أثناء تغيير كلمة المرور"
//         );
//       }
//     }
//   };

//   return (
//     <div className="relative grdianBK font-cairo min-h-screen flex items-center">
//       <div className="container mx-auto px-4">
//         <div className="grid lg:grid-cols-2 gap-8 items-center">
//           {/* Form Section */}
//           <div className="my-10" style={{ direction: "ltr" }}>
//             <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg mx-auto">
//               <h1 className="text-center font-bold text-2xl md:text-3xl mb-6 mainColor">
//                 {translate?.pages.changePassword.title || "تغيير كلمة المرور"}
//               </h1>

//               <p className="text-gray-600 text-center mb-8">
//                 {translate?.pages.changePassword.subtitle ||
//                   "أدخل كلمة المرور الحالية ثم اختر كلمة مرور جديدة"}
//               </p>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Old Password */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     {translate?.pages.changePassword.oldPassword || "كلمة المرور الحالية"}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword.old ? "text" : "password"}
//                       name="old_password"
//                       value={form.old_password}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg
//                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//                                transition-colors outline-none"
//                       placeholder="••••••••"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("old")}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2
//                                  text-gray-500 hover:text-gray-700"
//                     >
//                       {showPassword.old ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     {translate?.pages.changePassword.password || "كلمة المرور الجديدة"}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword.new ? "text" : "password"}
//                       name="password"
//                       value={form.password}
//                       onChange={handleChange}
//                       required
//                       minLength={8}
//                       className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg
//                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//                                transition-colors outline-none"
//                       placeholder="•••••••• (8 أحرف على الأقل)"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("new")}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2
//                                  text-gray-500 hover:text-gray-700"
//                     >
//                       {showPassword.new ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     {translate?.pages.changePassword.passwordHint ||
//                       "يجب أن تكون 8 أحرف على الأقل"}
//                   </p>
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     {translate?.pages.changePassword.confirmPassword || "تأكيد كلمة المرور"}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword.confirm ? "text" : "password"}
//                       name="password_confirmation"
//                       value={form.password_confirmation}
//                       onChange={handleChange}
//                       required
//                       className="w-full p-3 pl-4 pr-12 border border-gray-300 rounded-lg
//                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
//                                transition-colors outline-none"
//                       placeholder="••••••••"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => togglePasswordVisibility("confirm")}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2
//                                  text-gray-500 hover:text-gray-700"
//                     >
//                       {showPassword.confirm ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold
//                            py-3 px-4 rounded-lg flex justify-center items-center
//                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
//                            shadow-md hover:shadow-lg"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       {translate?.pages.changePassword.processing || "جاري المعالجة..."}
//                     </>
//                   ) : (
//                     translate?.pages.changePassword.confirmBtn || "تغيير كلمة المرور"
//                   )}
//                 </button>

//                 {/* Cancel Button */}
//                 <button
//                   type="button"
//                   onClick={() => router.push(`/${lang}`)}
//                   className="w-full border border-gray-300 text-gray-700 font-medium
//                            py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   {"إلغاء"}
//                 </button>
//               </form>
//             </div>
//           </div>


//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;