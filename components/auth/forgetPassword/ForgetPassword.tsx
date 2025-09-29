/* app/[lang]/forget-password/page.tsx */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActSendResetCode } from "@/store/auth/thunkActions/ActAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useRouter } from "next/navigation";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import forgetPass from "@/public/assets/images/forgetPass.svg";

const ForgetPassword = () => {
    const dispatch = useAppDispatch();
    const { status } = useAppSelector(state => state.auth);
    const lang = LangUseParams();
    const translate = TranslateHook();
    const router = useRouter();

    const [email, setEmail] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await dispatch(ActSendResetCode({ email }));
        if (ActSendResetCode.fulfilled.match(res)) {
            toast.success(translate?.pages.forgetPassword?.sent || "Reset code sent");
            // navigate to verify page with email query
            router.push(`/${lang}/verify-code?email=${encodeURIComponent(email)}`);
        } else {
            toast.error((res.payload as string) || "Failed to send reset code");
        }
    };

    return (
        <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
            <div className="grid lg:grid-cols-2 gap-4 items-center">
                <div className="my-10" style={{ direction: "ltr" }}>
                    <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
                        {translate?.pages.forgetPassword?.title || "Forgot Password"}
                    </h1>

                    <form onSubmit={handleSubmit} className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative">
                        <div className="mb-4">
                            <label className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"}`}>
                                {translate?.pages.forgetPassword?.email || "Email"}
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
                                disabled={status === "loading"}
                                className="w-full bkMainColor text-white 
                                font-bold py-3 px-4 mt-5 rounded-lg flex justify-center
                                 items-center cursor-pointer"
                            >
                                {status === "loading"
                                    ?
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {translate?.pages.forgetPassword?.sending || "Sending..."}
                                    </>
                                    : (translate?.pages.forgetPassword?.send || "Send code")}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="relative lg:block">
                    <div>
                        <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
                    </div>
                    <Image
                        src={forgetPass}
                        fill
                        className="max-w-[70%] max-h-[50%] m-auto"
                        alt="loginauth"
                    />
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword