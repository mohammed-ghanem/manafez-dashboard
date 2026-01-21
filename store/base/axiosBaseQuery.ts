// store/base/axiosBaseQuery.ts
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";
import api, { sanctumApi } from "@/services/api";

// دالة للحصول على CSRF token

let csrfPromise: Promise<string | null> | null = null;

const ensureCSRFToken = async () => {
  if (Cookies.get("XSRF-TOKEN")) {
    return Cookies.get("XSRF-TOKEN")!;
  }

  if (!csrfPromise) {
    csrfPromise = sanctumApi.get("/sanctum/csrf-cookie").then(() => {
      return Cookies.get("XSRF-TOKEN") || null;
    });
  }

  return csrfPromise;
};

// const ensureCSRFToken = async (): Promise<string | null> => {
//   try {
//     // تحقق إذا كان CSRF token موجوداً
//     const csrfToken = Cookies.get("XSRF-TOKEN");
//     if (csrfToken) {
//       return csrfToken;
//     }
 
//     // إذا لم يكن موجوداً، احصل عليه
//     console.log("🔄 Fetching CSRF token from Sanctum...");
//     await sanctumApi.get("/sanctum/csrf-cookie");
    
//     // انتظر قليلاً لضمان حفظ cookie
//    // await new Promise(resolve => setTimeout(resolve, 100));
    
//     // احصل على token الجديد
//     const newCsrfToken = Cookies.get("XSRF-TOKEN");
//     console.log("✅ CSRF token retrieved:", newCsrfToken);
//     return newCsrfToken || null;
//   } catch (error) {
//     console.error("❌ Failed to get CSRF token:", error);
//     return null;
//   }
// };

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      withCsrf?: boolean;
      auth?: boolean;
    },
    unknown,
    unknown
  > =>
  async ({ 
    url, 
    method = "get", 
    data, 
    params, 
    headers = {}, 
    withCsrf = false,
    auth = false 
  }) => {
    try {
      // console.log(`📡 Starting request: ${method?.toUpperCase()} ${url}`);
      // console.log("📦 Request data:", data);

      // إذا كانت العملية تحتاج CSRF token
      if (withCsrf && ["post", "put", "patch", "delete"].includes((method || "get").toLowerCase())) {
        const csrfToken = await ensureCSRFToken();
        if (csrfToken) {
          headers["X-XSRF-TOKEN"] = csrfToken;
        }
      }

      // إضافة Authorization token
      if (auth) {
        const token = Cookies.get("access_token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      // إضافة reset_token إذا لم يكن هناك access_token
      if (!headers["Authorization"] && Cookies.get("reset_token")) {
        const resetToken = Cookies.get("reset_token");
        headers["Authorization"] = `Bearer ${resetToken}`;
      }

      console.log("🎯 Final headers:", headers);

      const result = await api({
        url,
        method,
        data,
        params,
        headers,
      });

      console.log("✅ Response success:", result.status, result.data);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      
      // console.error("❌ Request failed:");
      // console.error("   Status:", err.response?.status);
      // console.error("   Status Text:", err.response?.statusText);
      // console.error("   Data:", err.response?.data);
      // console.error("   Headers:", err.response?.headers);
      
      // إذا كان الخطأ 419 (CSRF token mismatch)، حاول مرة أخرى
      if (err.response?.status === 419) {
        console.log("🔄 419 error detected, clearing CSRF token and retrying...");
        Cookies.remove("XSRF-TOKEN");
      }
      
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };










// // axiosBaseQuery.ts
// import type { BaseQueryFn } from "@reduxjs/toolkit/query";
// import type { AxiosRequestConfig, AxiosError } from "axios";
// import Cookies from "js-cookie";
// import api from "@/services/api";

// // أنشئ axios instance خاص للـ CSRF
// const getCSRFToken = async (): Promise<string | null> => {
//   try {
//     // هذا مشابه للقديم
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`,
//       {
//         credentials: 'include',
//         headers: {
//           'Accept': 'application/json',
//         }
//       }
//     );
    
//     if (response.ok) {
//       // احصل على CSRF token من cookies
//       const csrfToken = Cookies.get("XSRF-TOKEN");
//       console.log("CSRF Token retrieved:", csrfToken);
//       return csrfToken || null;
//     }
//     return null;
//   } catch (error) {
//     console.error("Failed to get CSRF token:", error);
//     return null;
//   }
// };

// export const axiosBaseQuery =
//   (): BaseQueryFn<
//     {
//       url: string;
//       method?: AxiosRequestConfig["method"];
//       data?: AxiosRequestConfig["data"];
//       params?: AxiosRequestConfig["params"];
//       headers?: AxiosRequestConfig["headers"];
//       withCsrf?: boolean;  // إضافة جديد
//       auth?: boolean;
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ 
//     url, 
//     method = "get", 
//     data, 
//     params, 
//     headers = {}, 
//     withCsrf = false,
//     auth = false 
//   }) => {
//     try {
//       // إذا طلبنا CSRF token
//       if (withCsrf) {
//         const csrfToken = await getCSRFToken();
//         if (csrfToken) {
//           headers["X-XSRF-TOKEN"] = csrfToken;
//         }
        
//         // انتظر قليلاً مثل الكود القديم
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }

//       // إضافة Authorization token
//       if (auth) {
//         const token = Cookies.get("access_token");
//         if (token) {
//           headers["Authorization"] = `Bearer ${token}`;
//         }
//       }

//       console.log(`🔗 Request: ${method} ${url}`);
//       console.log("📤 Headers:", headers);

//       const result = await api({
//         url,
//         method,
//         data,
//         params,
//         headers,
//         // مع الـ withCredentials: true مثل الكود القديم
//       });

//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       console.error("❌ Axios Error:", err.response?.data);
//       return {
//         error: err.response?.data || err.message,
//       };
//     }
//   };









// import type { BaseQueryFn } from "@reduxjs/toolkit/query";
// import type { AxiosRequestConfig, AxiosError } from "axios";
// import api from "@/services/api";

// export const axiosBaseQuery =
//   (): BaseQueryFn<
//     {
//       url: string;
//       method?: AxiosRequestConfig["method"];
//       data?: AxiosRequestConfig["data"];
//       params?: AxiosRequestConfig["params"];
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method = "get", data, params }) => {
//     try {
//       const result = await api({
//         url,
//         method,
//         data,
//         params,
//       });
//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       return {
//         error: err.response?.data || err.message,
//       };
//     }
//   };
