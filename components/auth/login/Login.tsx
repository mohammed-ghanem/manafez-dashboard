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
  const { loading, error } = useAppSelector((state) => state.auth);

  const lang = LangUseParams();
  const translate = TranslateHook();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(ActLogin(form));

    if (ActLogin.fulfilled.match(result)) {
      toast.success(
        translate?.pages.login.LoginSuccessful || "Login successful",
        {
          description:
            translate?.pages.login.LoginSuccessfulDescription ||
            "You have successfully logged in.",
        }
      );
      setTimeout(() => {
        window.location.href = `/${lang}/`;
      }, 1000);
    } else {
      toast.error(result.payload as string, {
        description:
          translate?.pages.login.InvalidEmailOrPasswordDescription ||
          "Please check your email and password and try again.",
      });
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
                className={`block text-sm font-bold leading-6 mainColor ${
                  lang === "en" ? "text-start" : "text-end"
                }`}
              >
                {translate?.pages.login.email || "Email"}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border bg-white
                 border-gray-300 rounded-md shadow-sm outline-none"
              />
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                className={`block text-sm font-bold leading-6 mainColor ${
                  lang === "en" ? "text-start" : "text-end"
                }`}
              >
                {translate?.pages.login.passwordName || "Password"}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
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
                disabled={loading === "pending"}
                className="w-full bkMainColor text-white font-bold
                 py-3 px-4 mt-5 rounded-lg flex justify-center items-center cursor-pointer"
              >
                {loading === "pending" ? (
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










// "use client";

// import { useState, ChangeEvent, FormEvent } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import Image from "next/image";
// import { Loader2 } from "lucide-react";
// import whiteAuthBk from "@/public/assets/images/Vector.svg";
// import loginIcon from "@/public/assets/images/loginIcon.svg";
// import TranslateHook from "@/translate/TranslateHook";
// import LangUseParams from "@/translate/LangUseParams";
// import { toast } from "sonner";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const Login = () => {
//   const lang = LangUseParams();
//   const translate = TranslateHook();

//   const [form, setForm] = useState<LoginFormData>({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//         withCredentials: true,
//       });

//       const csrfToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("XSRF-TOKEN="))
//         ?.split("=")[1];

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/login`,
//         form,
//         {
//           headers: {
//             "X-XSRF-TOKEN": csrfToken,
//             "Api-Key": process.env.NEXT_PUBLIC_API_KEY,
//           },
//           withCredentials: true,
//         }
//       );

//       const accessToken = response.data.data.access_token;
//       Cookies.set("access_token", accessToken, { expires: 7 });


//       // ✅ Success toast
//       toast.success(
//         translate ? translate.pages.login.LoginSuccessful : "Login Successful!",
//         {
//           description:
//             translate?.pages.login.LoginSuccessfulDescription ||
//             "You have successfully logged in.",
//         }
//       );

//       setTimeout(() => {
//         window.location.href = `/${lang}/`;
//       }, 1000);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 422) {
//           setErrors(
//             translate?.pages.login.InvalidEmailOrPassword || "Invalid Email Or Password"
//           );
//           toast.error(
//             translate?.pages.login.InvalidEmailOrPassword ||
//             "Invalid Email Or Password",
//             {
//               description:
//                 translate?.pages.login.InvalidEmailOrPasswordDescription ||
//                 "Please check your email and password and try again.",
//             }
//           );
//         } else if (error.code === "ERR_NETWORK") {
//           toast.error(translate?.pages.login.NetworkError || "Network Error", {
//             description:
//               translate?.pages.login.NetworkErrorDescription ||
//               "Please check your internet connection and try again.",
//           });


//         } else {
//           toast.error(
//             translate?.pages.login.SomethingWentWrong || "Something went wrong!",
//             {
//               description:
//                 translate?.pages.login.SomethingWentWrongDescription ||
//                 "Please try again later.",
//             }
//           );
//         }
//       } else {
//         console.error("Error", error);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
//       <div className="grid lg:grid-cols-2 gap-4 items-center">
//         <div className="my-10" style={{ direction: "ltr" }}>
//           <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
//             {translate ? translate.pages.login.loginTitle : ""}
//           </h1>
//           <form
//             onSubmit={handleSubmit}
//             className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative"
//           >
//             <div className="mb-4">
//               <label
//                 className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"
//                   }`}
//               >
//                 {translate ? translate.pages.login.email : ""}
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full p-2 border bg-white
//                  border-gray-300 rounded-md shadow-sm outline-none"
//               />
//               {errors && <p className="text-red-500">{errors}</p>}
//             </div>
//             <div className="mb-4">
//               <label
//                 className={`block text-sm font-bold leading-6 
//                   mainColor ${lang === "en" ? "text-start" : "text-end"
//                   }`}
//               >
//                 {translate ? translate.pages.login.passwordName : ""}
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full p-2 border bg-white
//                  border-gray-300 rounded-md shadow-sm outline-none"
//               />
//               {errors && <p className="text-red-500">{errors}</p>}
//             </div>
//             <a
//               href={`/${lang}/forget-password`}
//               className="border-b border-regal-blue"
//             >
//               {translate ? translate.pages.login.forgetPassword : ""}
//             </a>
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bkMainColor text-white font-bold
//                  py-3 px-4 mt-5 rounded-lg flex justify-center items-center cursor-pointer"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     {translate?.pages.login.processing || "Processing..."}
//                   </>
//                 ) : (
//                   translate?.pages.login.loginButton || "Login"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//         <div className="relative lg:block">
//           <div>
//             <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
//           </div>
//           <Image
//             src={loginIcon}
//             fill
//             className="max-w-[70%] max-h-[50%] m-auto"
//             alt="loginauth"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;