/* eslint-disable @typescript-eslint/no-explicit-any */
// components/LogoutButton.tsx
"use client";

import { useLogoutMutation } from "@/store/auth/authApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LogoutButtonProps {
  redirectTo?: string; // المسار بعد تسجيل الخروج
  children?: React.ReactNode; // محتوى مخصص للزر
  className?: string; // كلاسات CSS إضافية
  variant?: "default" | "outline" | "destructive" | "ghost"; // أنماط الزر
  showIcon?: boolean; // إظهار أيقونة
  onSuccess?: () => void; // callback عند النجاح
  onError?: (error: any) => void; // callback عند الخطأ
}

const LogoutButton = ({ 
  redirectTo = "/login", 
  children, 
  className = "",
  variant = "ghost",
  showIcon = true,
  onSuccess,
  onError
}: LogoutButtonProps) => {
  // استخدام RTK Query mutation hook
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // تأكيد من المستخدم قبل تسجيل الخروج
      const confirmed = window.confirm(
        "هل أنت متأكد أنك تريد تسجيل الخروج؟"
      );
      
      if (!confirmed) return;

      // إرسال طلب تسجيل الخروج
      const result = await logout().unwrap();
      
      // عرض رسالة النجاح
      toast.success(
        result?.message || result?.data?.message 
      );

      // تنظيف الـ cookies يدوياً
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("reset_token", { path: "/" });
      
      // تنظيف localStorage إذا كنت تستخدمه
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_state");
      }

      // استدعاء callback النجاح إذا وجد
      if (onSuccess) {
        onSuccess();
      }

      // إعادة التوجيه بعد تأخير بسيط
      setTimeout(() => {
        if (redirectTo.startsWith("/")) {
          // للروابط الداخلية
          router.push(redirectTo);
          router.refresh(); // تحديث الصفحة لضمان تطبيق التغييرات
        } else {
          // للروابط الخارجية
          window.location.href = redirectTo;
        }
      }, 1500);

    } catch (err: any) {
      console.error("Logout error:", err);
      
      // تحليل الخطأ وعرض الرسالة المناسبة
      let errorMessage = "فشل تسجيل الخروج. حاول مرة أخرى.";
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
      
      // تنظيف الـ cookies حتى في حالة فشل الطلب (لسلامة الجلسة)
      Cookies.remove("access_token", { path: "/" });
      
      // استدعاء callback الخطأ إذا وجد
      if (onError) {
        onError(err);
      }
      
      // إعادة التوجيه إلى صفحة تسجيل الدخول في حالة الخطأ أيضاً
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  };

  // تصميم الزر حسب الـ variant
  const getButtonStyles = () => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";
    
    switch (variant) {
      case "destructive":
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 ${className}`;
      case "outline":
        return `${baseStyles} border border-gray-300 text-gray-700 hover:bg-gray-50 ${className}`;
      case "ghost":
        return `${baseStyles} text-red-600 hover:bg-red-50 ${className}`;
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 ${className}`;
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={getButtonStyles()}
      aria-label="تسجيل الخروج"
      title="تسجيل الخروج من الحساب"
    >
      {isLoading ? (
        <>
          {showIcon && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>جاري تسجيل الخروج...</span>
        </>
      ) : (
        <>
          {showIcon && (
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          )}
          <span>{children || "تسجيل الخروج"}</span>
        </>
      )}
    </button>
  );
};

export default LogoutButton;