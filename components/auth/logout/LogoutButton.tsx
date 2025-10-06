"use client";

import { useAppDispatch } from "@/store/hooks";
import { ActLogout } from "@/store/auth/thunkActions/ActAuth";
import { toast } from "sonner";

interface LogoutButtonProps {
    redirectTo?: string; // default redirect path
    children?: React.ReactNode; // optional custom label
}

const LogoutButton = ({ redirectTo = "/login", children }: LogoutButtonProps) => {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        const res = await dispatch(ActLogout());

        if (ActLogout.fulfilled.match(res)) {
            toast.success(res.payload?.message || "Logout successful");
            setTimeout(() => {
                window.location.replace(redirectTo);
            }, 1000); // wait 1 seconds so toast appears
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer w-full text-left"
        >
            {children || "Logout"}
        </button>
    );
};

export default LogoutButton;
