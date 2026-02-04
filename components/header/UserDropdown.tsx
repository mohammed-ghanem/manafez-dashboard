"use client";

import { useState, useRef, useEffect } from "react";
import { useGetProfileQuery } from "@/store/auth/authApi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  UserCircle,
  ChevronDown,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
} from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

interface UserDropdownProps {
  showUserName?: boolean;
}

const UserDropdown = ({ showUserName = true }: UserDropdownProps) => {
  const router = useRouter();
  const lang = LangUseParams();
  const translate = TranslateHook();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const token = Cookies.get("access_token");

  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  const user = profileData?.data || profileData?.user || profileData;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  

  const handleLogout = () => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("reset_token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    setIsOpen(false);
    router.replace(`/${lang}/login`);
  };

  if (!token) {
    return null;
  }

  // skeleton while loading
 if (isLoading) {
    return (
     <div className="w-28 h-8 rounded-md bg-gray-300 animate-pulse" />
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none focus:ring-0
          focus:ring-opacity-50 rounded-lg p-1 transition-colors hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name || "User avatar"} 
              width={40} 
              height={40}
              className="object-cover"
            />
          ) : (
            <UserCircle className="w-full h-full text-blue-600" />
          )}
        </div>

        {showUserName && (
          <div className="hidden md:flex md:flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {user.name}
            </span>
            {user.email && (
              <span className="text-xs text-gray-500 truncate max-w-30">
                {user.email}
              </span>
            )}
          </div>
        )}

        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-100 animate-in fade-in slide-in-from-top-1">
          <div className="p-3 border-b border-gray-100">
            <div className="font-medium text-gray-900">{user.name}</div>
            {user.email && (
              <div className="text-sm text-gray-500 truncate">{user.email}</div>
            )}
          </div>

          <div className="py-1">
            <Link
              href={`/${lang}/profile`}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-4 h-4" />
              <span>
                {translate?.pages.userDropDown.profile || ""}
              </span>
            </Link>

            <Link
              href={`/${lang}/change-password`}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>{translate?.pages.userDropDown.changePassword || ""}</span>
            </Link>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>{translate?.pages.userDropDown.logout || ""}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;