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

const SideBar = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (lang && translate) setLoading(false);
  }, [lang, translate]);

  // auto-open settings if active route inside it
  useEffect(() => {
    if (pathname.includes("/admins") || pathname.includes("/roles") || pathname.includes("/profile")) {
      setOpenSettings(true);
    }
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const linkClass = (active: boolean) =>
    `flex items-center gap-2 p-2 rounded font-semibold transition
     ${active ? "activeLink" : "scoundColor hover-mainColor"}`;

  const SkeletonItem = () => (
    <div className="flex items-center gap-2 p-2">
      <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
      <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
    </div>
  );

  return (
    <aside className="w-60 text-white flex flex-col">
      <div className="p-4 font-bold text-lg mainColor">
        My Dashboard
      </div>

      <nav className="flex-1">
        <ul className="space-y-1 p-2">

          {loading ? (
            <>
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </>
          ) : (
            <>
              {/* Dashboard */}
              <li>
                <Link
                  href={`/${lang}`}
                  className={linkClass(isActive(`/${lang}`))}
                >
                  <Home size={18} />
                  {translate.sidebar.dashboard}
                </Link>
              </li>

              {/* Roles */}
              <li>
                <Link
                  href={`/${lang}/roles`}
                  className={linkClass(isActive(`/${lang}/roles`))}
                >
                  <ShieldCheck size={18} />
                  {translate.sidebar.roles}
                </Link>
              </li>
              {/* admins */}
              <li>
                <Link
                  href={`/${lang}/admins`}
                  className={linkClass(isActive(`/${lang}/admins`))}
                >
                  <Users size={18} />
                  {translate.sidebar.admins}
                </Link>
              </li>

              {/* Settings Dropdown */}
              <li>
                <button
                  onClick={() => setOpenSettings(!openSettings)}
                  className="w-full flex items-center justify-between p-2 rounded font-semibold scoundColor hover-mainColor transition"
                >
                  <span className="flex items-center gap-2">
                    <Settings size={18} />
                    {translate.sidebar.settings || "Settings"}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      openSettings ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300
                  ${openSettings ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <Link
                    href={`/${lang}/privacy-policy`}
                    className={linkClass(isActive(`/${lang}/privacy-policy`))}
                  >
                    <ShieldCheck size={18} />
                    privacy-policy
                  </Link>

                  <Link
                    href={`/${lang}/profile`}
                    className={linkClass(isActive(`/${lang}/profile`))}
                  >
                    <UserCog size={16} />
                    {translate.sidebar.profile || "Profile"}
                  </Link>
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;







// "use client";

// import Link from "next/link";
// import { Home, ShieldCheck , Settings } from "lucide-react";
// import LangUseParams from "@/translate/LangUseParams";
// import TranslateHook from "@/translate/TranslateHook";
// import { useEffect, useState } from "react";


// const SideBar = () => {
//   const lang = LangUseParams();
//   const translate = TranslateHook();

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (lang && translate) {
//       setLoading(false);
//     }
//   }, [lang, translate]);

//   // skeleton item
//   const SkeletonItem = () => (
//     <div className="flex items-center gap-2 p-2">
//       <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
//       <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
//     </div>
//   );

//   return (
//     <aside className="w-60 text-white flex flex-col">
//       <div className="p-4 font-bold text-lg mainColor">My Dashboard</div>

//       <nav className="flex-1">
//         <ul className="space-y-2 p-2">

//           {loading ? (
//             <>
//               <SkeletonItem />
//               <SkeletonItem />
//               <SkeletonItem />
//               <SkeletonItem />
//             </>
//           ) : (
//             <>
//               <li>
//                 <Link
//                   href={`/${lang}`}
//                   className="flex items-center gap-2 p-2 rounded font-semibold activeLink hover-mainColor"
//                 >
//                   <Home size={18} />
//                   {translate.sidebar.dashboard}
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href={`/${lang}/roles`}
//                   className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
//                 >
//                   <ShieldCheck size={18}/>
//                   {translate.sidebar.roles}
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href={`/${lang}/admins`}
//                   className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
//                 >
//                   <Settings size={18} />
//                   {translate.sidebar.admins}
//                 </Link>
//               </li>

//               <li>
//                 <Link
//                   href="/dashboard/settings"
//                   className="flex items-center gap-2 p-2 rounded font-semibold scoundColor hover-mainColor"
//                 >
//                   <Settings size={18} />
//                   Settings
//                 </Link>
//               </li>

          
//             </>
//           )}
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default SideBar;