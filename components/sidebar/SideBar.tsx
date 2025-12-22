"use client";

import Link from "next/link";
import { Home, ShieldCheck , Settings } from "lucide-react";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import { useEffect, useState } from "react";


const SideBar = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lang && translate) {
      setLoading(false);
    }
  }, [lang, translate]);

  // skeleton item
  const SkeletonItem = () => (
    <div className="flex items-center gap-2 p-2">
      <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
      <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
    </div>
  );

  return (
    <aside className="w-60 text-white flex flex-col">
      <div className="p-4 font-bold text-lg mainColor">My Dashboard</div>

      <nav className="flex-1">
        <ul className="space-y-2 p-2">

          {loading ? (
            <>
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </>
          ) : (
            <>
              <li>
                <Link
                  href={`/${lang}`}
                  className="flex items-center gap-2 p-2 rounded font-semibold activeLink hover-mainColor"
                >
                  <Home size={18} />
                  {translate.sidebar.dashboard}
                </Link>
              </li>

              <li>
                <Link
                  href={`/${lang}/roles`}
                  className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
                >
                  <ShieldCheck size={18}/>
                  {translate.sidebar.roles}
                </Link>
              </li>

              <li>
                <Link
                  href={`/${lang}/admins`}
                  className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
                >
                  <Settings size={18} />
                  {translate.sidebar.admins}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
                >
                  <Settings size={18} />
                  Settings
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
                >
                  <Settings size={18} />
                  Settings
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;