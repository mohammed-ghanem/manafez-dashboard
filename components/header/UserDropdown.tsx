"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { ActLogout } from "../../store/auth/thunkActions/ActAuth";
import { ChevronDown } from "lucide-react";
import { User } from "lucide-react";
import Image from "next/image";

const UserDropdown = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    if (!user) {
        return <span className="cursor-pointer">
            <User className="w-5 h-5 cursor-pointer" />
            Login
        </span>;
    }

    const handleLogout = async () => {
        await dispatch(ActLogout());
        window.location.replace("/login"); // full reload, no back button to dashboard
    };

    return (
        <div className="relative">
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <Image
                    src={user.image || "/default-avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />
                <span className="">hi {user.name}</span>
                <ChevronDown className="w-4 h-4 text-white" />
            </div>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <ul className="py-1">
                        <li className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                            Reset Password
                        </li>
                        <li
                            className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
