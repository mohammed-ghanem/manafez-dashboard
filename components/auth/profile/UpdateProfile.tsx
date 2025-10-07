"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchProfile, ActUpdateProfile } from "@/store/auth/thunkActions/ActUser";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import "react-phone-input-2/lib/style.css";
import "./style.css";
import TranslateHook from "@/translate/TranslateHook";
import LangUseParams from "@/translate/LangUseParams";

function UpdateProfile() {
    const lang = LangUseParams();
    const translate = TranslateHook();
    const dispatch = useAppDispatch();
    const { user, error } = useAppSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        dispatch(ActFetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
            });
            setInitialLoading(false);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value: string) => {
        setForm({ ...form, mobile: "+" + value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const result = await dispatch(ActUpdateProfile(form)).unwrap();
            toast.success(result.message || "Profile updated successfully");
            window.location.reload();
        } catch (err: unknown) {
            toast.error((err as Error).message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading only for initial data fetch, not for form submission
    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        toast.error(error);
    }

    return (
        <div className="max-w-md mx-auto p-6" dir="ltr">
            <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                        {translate?.pages.updateProfile.title || "Update Profile"}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        {translate?.pages.updateProfile.titleUpdate || "Update Profile"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name"
                                className={`text-sm font-medium
                                ${lang === "ar" || lang === "" ? 'justify-end' : 'justify-start'}
                                `}>
                                {translate?.pages.updateProfile.name || "Update Profile"}
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="pl-10 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email"
                                className={`text-sm font-medium
                                ${lang === "ar" || lang === "" ? 'justify-end' : 'justify-start'}
                                `}
                            >
                                {translate?.pages.updateProfile.email || "Email Address"}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Label htmlFor="mobile"
                                className={`text-sm font-medium
                                ${lang === "ar" || lang === "" ? 'justify-end' : 'justify-start'}
                                `}
                            >
                                {translate?.pages.updateProfile.phone || "Phone Number"}
                            </Label>
                            <div className="relative">
                                <PhoneInput
                                    country="eg"
                                    value={form.mobile.replace("+", "")}
                                    onChange={handlePhoneChange}
                                    inputClass="!w-full !h-10 !pl-12 !rounded-md !border !border-input !bg-background"
                                    containerClass="w-full"
                                    buttonClass="!bg-background !border-r !border-input"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full text-white bkMainColor cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    {translate?.pages.updateProfile.processing || "Processing..."}
                                </>
                            ) : (
                                translate?.pages.updateProfile.confirmBtn || "Confirm"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default UpdateProfile;