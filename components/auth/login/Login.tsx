/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useLoginMutation } from "@/store/auth/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import loginIcon from "@/public/assets/images/loginIcon.svg";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";
import { Skeleton } from "@/components/ui/skeleton";

const Login = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const lang = LangUseParams();
  const translate = TranslateHook();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

      toast.success(res?.message || translate?.pages.login.success);

      // Redirect بدون reload
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
            {translate?.pages.login.loginTitle || <Skeleton className="h-10 w-48 mx-auto" />} 
          </h1>

          <form
            onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto"
          >
            <div className="mb-4">
              <label className="block text-sm font-bold mainColor">
                {translate?.pages.login.email || <Skeleton className="h-5 w-24" />}
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
                {translate?.pages.login.passwordName  || <Skeleton className="h-5 w-24" />}
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
              {translate?.pages.login.forgetPassword  || <Skeleton className="h-5 w-32" />}
            </a>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bkMainColor text-white py-3 mt-5 rounded-lg flex justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {translate?.pages.login.processing  }
                </>
              ) : (
                translate?.pages.login.loginButton 
              )}
            </button>
          </form>
        </div>

        {/* Image */}
        <div className="relative hidden lg:block">
          <Image src={whiteAuthBk} alt="bg" priority />
          <Image
            src={loginIcon}
            alt="login"
            fill
            className="max-w-[70%] max-h-[50%] m-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Login;








// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, ChangeEvent, FormEvent } from "react";
// import { useLoginMutation } from "@/store/auth/authApi";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import Image from "next/image";
// import whiteAuthBk from "@/public/assets/images/Vector.svg";
// import loginIcon from "@/public/assets/images/loginIcon.svg";
// import TranslateHook from "@/translate/TranslateHook";
// import LangUseParams from "@/translate/LangUseParams";

// const Login = () => {
//   const [login, { isLoading }] = useLoginMutation();

//   const lang = LangUseParams();
//   const translate = TranslateHook();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const res = await login(form).unwrap();

//       toast.success(res?.message || translate?.pages.login.success);

//       setTimeout(() => {
//         window.location.href = `/${lang}/`;
//       }, 1000);
//     } catch (err: any) {
//       const errorData = err?.data ?? err;

//       // Laravel validation errors (422)
//       if (errorData?.errors) {
//         Object.values(errorData.errors).forEach((messages: any) => {
//           messages.forEach((msg: string) => toast.error(msg));
//         });
//         return;
//       }

//       // Generic backend message
//       if (errorData?.message) {
//         toast.error(errorData.message);
//         return;
//       }
//     }
//   };

//   return (
//     <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
//       <div className="grid lg:grid-cols-2 gap-4 items-center">
//         {/* Form */}
//         <div className="my-10" style={{ direction: "ltr" }}>
//           <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
//             {translate?.pages.login.loginTitle || "Login"}
//           </h1>

//           <form
//             onSubmit={handleSubmit}
//             className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative"
//           >
//             <div className="mb-4">
//               <label className="block text-sm font-bold mainColor">
//                 {translate?.pages.login.email || "Email"}
//               </label>
//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-bold mainColor">
//                 {translate?.pages.login.passwordName || "Password"}
//               </label>
//               <input
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="mt-1 block w-full p-2 border rounded-md"
//               />
//             </div>
//             {/* Forget password */}
//             <a
//               href={`/${lang}/forget-password`}
//               className="border-b border-regal-blue"
//             >
//               {translate?.pages.login.forgetPassword || "Forgot password?"}
//             </a>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bkMainColor text-white py-3 mt-5 rounded-lg flex justify-center"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                   {translate?.pages.login.processing || "Processing..."}
//                 </>
//               ) : (
//                 translate?.pages.login.loginButton || "Login"
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Image */}
//         <div className="relative lg:block">
//           <Image src={whiteAuthBk} alt="bg" className="w-full" />
//           <Image
//             src={loginIcon}
//             alt="login"
//             fill
//             className="max-w-[70%] max-h-[50%] m-auto"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;