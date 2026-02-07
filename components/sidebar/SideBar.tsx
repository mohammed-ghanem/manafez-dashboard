"use client";

import Link from "next/link";
import {
  Home,
  ShieldCheck,
  Settings,
  Users,
  UserCog,
  ChevronDown,
} from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

/* =========================
   Sidebar Skeleton (shadcn)
========================= */
const SidebarSkeleton = () => {
  return (
    <div className="p-2 space-y-3">
      {/* Logo */}
      {/* <Skeleton className="hidden md:block h-5 w-32 mb-4" /> */}

      {/* Main links */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-center md:justify-start gap-0 md:gap-3 p-2"
        >
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="hidden md:block h-6 w-40" />
        </div>
      ))}

      {/* Settings title */}
      <div className="flex items-center justify-center md:justify-start gap-0 md:gap-3 p-2">
       <Skeleton className="w-6 h-6 rounded-md" />
      <Skeleton className="hidden md:block h-6 w-40" />
      </div>

      {/* Nested links */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-center md:justify-start gap-0 md:gap-3 p-2 md:ms-6"
        >
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="hidden md:block h-6 w-40" />
        </div>
      ))}
    </div>
  );
};

/* =========================
   Sidebar Component
========================= */
const SideBar = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (lang && translate) setLoading(false);
  }, [lang, translate]);

  useEffect(() => {
    if (pathname.includes("/profile") || pathname.includes("/privacy-policy")) {
      setOpenSettings(true);
    }
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const linkClass = (active: boolean) =>
    `flex items-center justify-center md:justify-start
     gap-0 md:gap-2 p-2 rounded font-semibold transition
     ${active ? "activeLink" : "scoundColor hover-mainColor"}`;

  return (
    <aside
      className="
        fixed inset-y-0 start-0 z-40
        h-screen
        w-14 md:w-60
        bg-white
        border-e
        flex flex-col
        transition-all duration-300
      "
    >
      {/* Logo */}
      <div className="p-4 font-bold text-lg mainColor flex justify-center md:justify-start">
        <span className="hidden md:inline">My Dashboard</span>
      </div>

      <nav className="flex-1">
        {loading ? (
          <SidebarSkeleton />
        ) : (
          <ul className="space-y-1 p-2">
            <li>
              <Link href={`/${lang}`} className={linkClass(isActive(`/${lang}`))}>
                <Home size={18} />
                <span className="hidden md:inline">
                  {translate.sidebar.dashboard}
                </span>
              </Link>
            </li>

            <li>
              <Link
                href={`/${lang}/roles`}
                className={linkClass(isActive(`/${lang}/roles`))}
              >
                <ShieldCheck size={18} />
                <span className="hidden md:inline">
                  {translate.sidebar.roles}
                </span>
              </Link>
            </li>

            <li>
              <Link
                href={`/${lang}/admins`}
                className={linkClass(isActive(`/${lang}/admins`))}
              >
                <Users size={18} />
                <span className="hidden md:inline">
                  {translate.sidebar.admins}
                </span>
              </Link>
            </li>

            <li>
              <button
                onClick={() => setOpenSettings(!openSettings)}
                className="
                  w-full flex items-center justify-center md:justify-between
                  p-2 rounded-md
                  text-sm text-gray-600
                  hover:bg-gray-100 transition
                  font-bold
                "
              >
                <span className="flex items-center gap-2">
                  <Settings size={18} />
                  <span className="hidden md:inline">
                    {translate.sidebar.settings}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`hidden md:inline transition-transform ${openSettings ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`md:ms-6 mt-1 ms-3 space-y-1 overflow-hidden transition-all duration-300 
                ${openSettings ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <Link
                  href={`/${lang}/privacy-policy`}
                  className={`${linkClass(
                    isActive(`/${lang}/privacy-policy`)
                  )} text-[16px]`}
                >
                  <ShieldCheck size={16} />
                  <span className="hidden md:inline">
                    {translate.sidebar.privacyPolicy}
                  </span>
                </Link>

                <Link
                  href={`/${lang}/profile`}
                  className={`${linkClass(
                    isActive(`/${lang}/profile`)
                  )} text-[16px]`}
                >
                  <UserCog size={16} />
                  <span className="hidden md:inline">
                    {translate.sidebar.profile}
                  </span>
                </Link>
              </div>
            </li>
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default SideBar;
