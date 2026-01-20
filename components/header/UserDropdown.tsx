
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

interface UserDropdownProps {
  showUserName?: boolean;
}

const UserDropdown = ({ showUserName = true }: UserDropdownProps) => {
  const router = useRouter();
  const lang = LangUseParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const token = Cookies.get("access_token");

  // لا تطلب profile بدون token
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  const user = profileData?.data || profileData?.user || profileData;

  // إغلاق القائمة عند النقر خارجها
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

    router.replace("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        {showUserName && (
          <div className="hidden md:block">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex items-center gap-2"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border">
          {user.image ? (
            <Image src={user.image} alt="avatar" width={40} height={40} />
          ) : (
            <UserCircle className="w-full h-full text-blue-600" />
          )}
        </div>

        {showUserName && (
          <span className="hidden md:block text-sm font-medium">
            {user.name}
          </span>
        )}

        <ChevronDown
          className={`w-4 h-4 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50">
          <Link
            href={`/${lang}/profile`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <UserIcon className="w-4 h-4" />
            البروفايل
          </Link>

          <Link
            href={`/${lang}/change-password`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
          >
            <SettingsIcon className="w-4 h-4" />
            تغيير كلمة المرور
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOutIcon className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;


















// // components/UserDropdown.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useLogoutMutation } from "@/store/auth/authApi";
// import { useGetProfileQuery } from "@/store/auth/authApi";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   UserCircle,
//   Loader2,
//   ChevronDown,
//   LogOutIcon,
//   UserIcon,
//   SettingsIcon
// } from "lucide-react";
// import LangUseParams from "@/translate/LangUseParams";

// interface UserDropdownProps {
//   className?: string;
//   showUserName?: boolean;
//   avatarSize?: "sm" | "md" | "lg";
// }

// const UserDropdown = ({
//   showUserName = true,
// }: UserDropdownProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const lang = LangUseParams();
  

//   // جلب بيانات المستخدم - بدون skip
//   const { data: profileData, isLoading: isLoadingProfile, error } = useGetProfileQuery();

  
//   const token = Cookies.get("access_token");

// const { data, isLoading } = useGetProfileQuery(undefined, {
//   skip: !token,
// });


//   // طلب تسجيل الخروج
//   const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

//   // استخراج بيانات المستخدم
//   const user = profileData?.data || profileData?.user || profileData;


//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // التعامل مع تسجيل الخروج
// const handleLogout = () => {
//   Cookies.remove("access_token", { path: "/" });
//   Cookies.remove("reset_token", { path: "/" });

//   router.replace("/login");
// };


//   const skeleton = (
//     <div className={`flex items-center gap-2 `}>
//       <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
//       {showUserName && (
//         <div className="hidden md:block">
//           <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
//           <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-1" />
//         </div>
//       )}
//     </div>
//   );

//   // إذا كان جارياً تحميل بيانات المستخدم
//   if (isLoadingProfile) {
//     return (skeleton);
//   }
//   // إذا حدث خطأ
//   if (error) {
//     console.error("Error loading profile:", error);
//     return (skeleton);
//   }
//   // إذا لم توجد بيانات المستخدم
//   if (!user) {
//     return (skeleton);
//   }

//   return (
//     <div className={`relative `} ref={dropdownRef}>
//       {/* زر فتح/إغلاق القائمة */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 p-1 rounded-lg transition-colors"
//         aria-label="قائمة المستخدم"
//         aria-expanded={isOpen}
//       >
//         {/* صورة المستخدم أو أيقونة */}
//         <div className="relative">
//           <div className="w-10 h-10 rounded-full overflow-hidden  from-blue-100 to-purple-100 border-2 border-white shadow-sm">
//             {user?.image ? (
//               <Image
//                 src={user.image}
//                 alt={user.name || "صورة المستخدم"}
//                 width={40}
//                 height={40}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <UserCircle className="w-6 h-6 text-blue-600" />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* اسم المستخدم (اختياري) */}
//         {showUserName && (
//           <div className="hidden md:flex flex-col items-start">
//             <span className="text-sm font-medium text-gray-700 leading-tight">
//               {user.name || "مستخدم"}
//             </span>
//             <span className="text-xs text-gray-500 leading-tight">
//               {user.roles || user.email || "حساب شخصي"}
//             </span>
//           </div>
//         )}

//         {/* سهم للإشارة */}
//         <ChevronDown
//           className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//         />
//       </button>

//       {/* القائمة المنسدلة */}
//       {isOpen && (
//         <div className="absolute right-[-50] mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
//           {/* رأس القائمة - معلومات المستخدم */}
//           <div className="p-4 border-b border-gray-100  from-blue-50 to-indigo-50">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full  from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
//                 {user?.image ? (
//                   <Image
//                     src={user.image}
//                     alt={user.name || "صورة المستخدم"}
//                     width={40}
//                     height={40}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <UserCircle className="w-6 h-6 text-blue-600" />
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="font-semibold text-gray-800 truncate">
//                   {user.name || "مستخدم"}
//                 </p>
//                 <p className="text-sm text-gray-500 truncate">
//                   {user.email || user.roles || "حساب شخصي"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* عناصر القائمة */}
//           <div className="py-2">
//             {/* البروفايل */}
//             <Link
//               href={`/${lang}/profile`}
//               onClick={() => setIsOpen(false)}
//               className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               <UserIcon className="w-4 h-4 text-blue-600" />
//               <span className="flex-1">البروفايل</span>
//             </Link>

//             {/* الإعدادات */}
//             <Link
//               href={`/${lang}/change-password`}
//               onClick={() => setIsOpen(false)}
//               className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               <SettingsIcon className="w-4 h-4 text-green-600" />
//               <span className="flex-1">تغيير كلمة المرور</span>
//             </Link>

//             {/* قسم تسجيل الخروج */}
//             <div className="border-t border-gray-100 mt-2 pt-2">
//               <button
//                 onClick={handleLogout}
//                 disabled={isLoggingOut}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoggingOut ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <LogOutIcon className="w-4 h-4" />
//                 )}
//                 <span className="flex-1">
//                   {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDropdown;