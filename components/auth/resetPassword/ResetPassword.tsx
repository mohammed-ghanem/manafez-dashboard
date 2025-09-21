/* app/[lang]/reset-password/page.tsx */
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActResetPassword } from "@/store/auth/thunkActions/ActAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import whiteAuthBk from "@/public/assets/images/Vector.svg";
import restpass from "@/public/assets/images/restpass.svg";

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(s => s.auth);
    const lang = LangUseParams();
    const translate = TranslateHook();
    const router = useRouter();
    const search = useSearchParams();

    const [email, setEmail] = useState(search?.get("email") ?? "");
    const [code, setCode] = useState(search?.get("code") ?? "");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    useEffect(() => {
        const qEmail = search?.get("email");
        const qCode = search?.get("code");
        if (qEmail) setEmail(qEmail);
        if (qCode) setCode(qCode);
    }, [search]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error(translate?.pages.resetPassword?.passwordMismatch || "Passwords do not match");
            return;
        }

        const res = await dispatch(ActResetPassword({ email, code, password, password_confirmation: confirm }));
        if (ActResetPassword.fulfilled.match(res)) {
            toast.success(translate?.pages.resetPassword?.success || "Password reset successful");
            router.push(`/${lang}/login`);
        } else {
            toast.error((res.payload as string) || "Reset failed");
        }
    };

    return (
        <div className="relative grdianBK font-cairo" style={{ direction: "rtl" }}>
            <div className="grid lg:grid-cols-2 gap-4 items-center">
                <div className="my-10" style={{ direction: "ltr" }}>
                    <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
                        {translate?.pages.resetPassword?.title || "Reset Password"}
                    </h1>

                    <form onSubmit={handleSubmit} className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative">
                        <div className="mb-4">
                            <label className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"}`}>{translate?.pages.resetPassword?.email || "Email"}</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none" />
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"}`}>{translate?.pages.resetPassword?.code || "Code"}</label>
                            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none" />
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"}`}>{translate?.pages.resetPassword?.password || "New Password"}</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none" />
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm font-bold leading-6 mainColor ${lang === "en" ? "text-start" : "text-end"}`}>{translate?.pages.resetPassword?.confirmPassword || "Confirm Password"}</label>
                            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm outline-none" />
                        </div>

                        <div>
                            <button type="submit" disabled={loading === "pending"} className="w-full bkMainColor text-white font-bold py-3 px-4 mt-5 rounded-lg flex justify-center items-center">
                                {loading === "pending"
                                    ?
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {translate?.pages.resetPassword?.processing || "Processing..."}
                                    </>
                                    :
                                    (translate?.pages.resetPassword?.confirmBtn || "Reset Password")}
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
                        src={restpass}
                        fill
                        className="max-w-[70%] max-h-[50%] m-auto"
                        alt="loginauth"
                    />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword