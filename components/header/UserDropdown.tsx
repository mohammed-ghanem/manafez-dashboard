"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { ChevronDown } from "lucide-react";
import { User } from "lucide-react";
import Image from "next/image";
import LogoutButton from "../auth/logout/LogoutButton";
import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";

const UserDropdown = () => {
    const [open, setOpen] = useState(false);
    const user = useAppSelector((state) => state.auth.user);
    const lang = LangUseParams();

    if (!user) {
        return <span className="cursor-pointer"><User className="w-5 h-5 cursor-pointer" /></span>;
    }
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
                            <Link href={`/${lang}/change-password`}>Change Password</Link>
                        </li>
                        <li>

                            <LogoutButton>Logout</LogoutButton>
                        </li>


                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
