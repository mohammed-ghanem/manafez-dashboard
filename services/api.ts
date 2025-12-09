// src/services/api.ts
import axios from "axios";
import Cookies from 'js-cookie';
import { store } from "../store/store";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// Single API instance with the full base URL including the API prefix
const api = axios.create({
  baseURL: `${BASE}/dashboard-api/v1`,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "api-key": API_KEY,
    "Api-Version": "v1", 
  },
});

// Separate instance for Sanctum CSRF calls (needs root base URL)
export const sanctumApi = axios.create({
  baseURL: BASE, // Root base URL for sanctum
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Helper functions
export const getCSRFToken = (): string | null => {
  // Guard for server-side rendering
  if (typeof window === 'undefined') return null;
  
  try {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    return cookieValue ? decodeURIComponent(cookieValue) : null;
  } catch (error) {
    console.error("Error getting CSRF token:", error);
    return null;
  }
};

export const refreshCSRFToken = async (): Promise<void> => {
  try {
    await sanctumApi.get("/sanctum/csrf-cookie", {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
      }
    });

    const newToken = getCSRFToken();
    if (!newToken) {
      throw new Error('CSRF token not set after refresh');
    }
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
    throw error;
  }
};

// Function to get auth token from cookie (SSR-safe)
const getAuthToken = (): string | null => {
  // Guard for server-side rendering
  if (typeof window === 'undefined') return null;
  
  try {
    // First try to get from Redux store (client-side only)
    const state = store.getState();
    if (state.auth.token) {
      return state.auth.token;
    }
    
    // Fallback to cookie if Redux store doesn't have it yet
    return Cookies.get("access_token") || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Main request interceptor - SSR SAFE
api.interceptors.request.use(
  (config) => {
    // 🔹 SERVER-SIDE: Only set basic headers
    if (typeof window === "undefined") {
      config.headers["api-key"] = API_KEY;
      config.headers["Api-Version"] = "v1";
      config.headers["Accept-Language"] = "ar"; // Default for server
      return config;
    }

    // 🔹 CLIENT-SIDE: Full interceptor logic
    
    // 1. Get auth token from cookie/Redux
    const token = getAuthToken();
    
    // 2. Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Set Accept-Language dynamically based on route
    const pathname = window.location.pathname;
    let lang = "ar"; // default
    if (pathname.startsWith("/ar")) lang = "ar";
    else if (pathname.startsWith("/en")) lang = "en";
    config.headers["Accept-Language"] = lang;

    // 4. Add CSRF token for mutating requests (client-only)
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(
      config.method?.toLowerCase() || ''
    );

    if (isMutating) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }

    // 5. Ensure API key is set
    if (API_KEY) {
      config.headers['api-key'] = API_KEY;
    }

    // Debug logging (client-only)
    console.log(`➡️ API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      language: config.headers["Accept-Language"],
      hasAuth: !!config.headers.Authorization,
      hasCSRF: !!config.headers['X-XSRF-TOKEN'],
      hasAPIKey: !!config.headers['api-key']
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with auth handling
api.interceptors.response.use(
  (response) => {
    // Client-only logging
    if (typeof window !== "undefined") {
      console.log(`✅ API Response Success: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    // Client-only logging
    if (typeof window !== "undefined") {
      console.error(`❌ API Response Error: ${error.response?.status} ${error.config?.url}`);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.log('🔐 Authentication failed, clearing credentials...');
        
        // Clear cookies and Redux store
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("user", { path: "/" });
        
        // Dispatch to Redux store
        store.dispatch({ type: 'auth/clearAuth' });
        
        // Redirect to login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Handle CSRF token mismatch
    if (error.response?.status === 419 && typeof window !== "undefined") {
      console.log('CSRF token mismatch detected, attempting to refresh...');
      try {
        await refreshCSRFToken();
        const csrfToken = getCSRFToken();
        if (csrfToken && error.config) {
          error.config.headers['X-XSRF-TOKEN'] = csrfToken;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('Failed to refresh CSRF token:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 🚨 REMOVE THIS DUPLICATE INTERCEPTOR - IT'S CAUSING CONFLICTS!
// api.interceptors.request.use((config) => {
//   const token = Cookies.get("access_token");
// 
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   config.headers["api-key"] = process.env.NEXT_PUBLIC_API_KEY;
//   config.headers["Accept-Language"] = "ar";
// 
//   return config;
// });

export default api;












// // src/services/api.ts
// import axios from "axios";
// import Cookies from 'js-cookie';
// import { store } from "../store/store";

// const BASE = process.env.NEXT_PUBLIC_BASE_URL;
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// // Single API instance with the full base URL including the API prefix
// const api = axios.create({
//   baseURL: `${BASE}/dashboard-api/v1`, // Move the prefix here
//   withCredentials: true,
//   xsrfCookieName: "XSRF-TOKEN",
//   xsrfHeaderName: "X-XSRF-TOKEN",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "api-key": API_KEY,
//     "Api-Version": "v1", 
//   },
// });

// // Separate instance for Sanctum CSRF calls (needs root base URL)
// export const sanctumApi = axios.create({
//   baseURL: BASE, // Root base URL for sanctum
//   withCredentials: true,
//   xsrfCookieName: "XSRF-TOKEN",
//   xsrfHeaderName: "X-XSRF-TOKEN",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// // Helper functions
// export const getCSRFToken = (): string | null => {
//   if (typeof window === 'undefined') return null;
  
//   const cookieValue = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('XSRF-TOKEN='))
//     ?.split('=')[1];

//   return cookieValue ? decodeURIComponent(cookieValue) : null;
// };

// export const refreshCSRFToken = async (): Promise<void> => {
//   try {
//     await sanctumApi.get("/sanctum/csrf-cookie", {
//       withCredentials: true,
//       headers: {
//         'Accept': 'application/json',
//       }
//     });

//     const newToken = getCSRFToken();
//     if (!newToken) {
//       throw new Error('CSRF token not set after refresh');
//     }
//   } catch (error) {
//     console.error('Error refreshing CSRF token:', error);
//     throw error;
//   }
// };

// // Enhanced request interceptor with auth token
// api.interceptors.request.use(
//   (config) => {
//     // 🔹 1. Get auth token from Redux store
//     const state = store.getState();
//     const token = state.auth.token;

//     // 🔹 2. Add Authorization header if token exists
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // 🔹 3. Set Accept-Language dynamically based on route
//     if (typeof window !== "undefined") {
//       const pathname = window.location.pathname;
//       let lang = "ar"; // default
//       if (pathname.startsWith("/ar")) lang = "ar";
//       else if (pathname.startsWith("/en")) lang = "en";
//       config.headers["Accept-Language"] = lang;
//     }

//     // 🔹 4. Add CSRF token for mutating requests
//     const isMutating = ['post', 'put', 'patch', 'delete'].includes(
//       config.method?.toLowerCase() || ''
//     );

//     if (isMutating) {
//       const csrfToken = getCSRFToken();
//       if (csrfToken) {
//         config.headers['X-XSRF-TOKEN'] = csrfToken;
//       }
//     }

//     // 🔹 5. Ensure API key is set
//     if (API_KEY) {
//       config.headers['api-key'] = API_KEY;
//     }

//     console.log(`➡️ API Request: ${config.method?.toUpperCase()} ${config.url}`, {
//       language: config.headers["Accept-Language"],
//       hasAuth: !!config.headers.Authorization,
//       hasCSRF: !!config.headers['X-XSRF-TOKEN'],
//       hasAPIKey: !!config.headers['api-key']
//     });

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Enhanced response interceptor with auth handling
// api.interceptors.response.use(
//   (response) => {
//     console.log(`✅ API Response Success: ${response.status} ${response.config.url}`);
//     return response;
//   },
//   async (error) => {
//     console.error(`❌ API Response Error: ${error.response?.status} ${error.config?.url}`);

//     // Handle authentication errors
//     if (error.response?.status === 401) {
//       console.log('🔐 Authentication failed, clearing credentials...');
//       store.dispatch({ type: 'auth/clearCredentials' });
      
//       if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }

//     if (error.response?.status === 419) { // CSRF token mismatch
//       console.log('CSRF token mismatch detected, attempting to refresh...');
//       try {
//         await refreshCSRFToken();
//         const csrfToken = getCSRFToken();
//         if (csrfToken && error.config) {
//           error.config.headers['X-XSRF-TOKEN'] = csrfToken;
//           return api.request(error.config);
//         }
//       } catch (refreshError) {
//         console.error('Failed to refresh CSRF token:', refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // AUTO inject headers like old project
// api.interceptors.request.use((config) => {
//   const token = Cookies.get("access_token");

//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   config.headers["api-key"] = process.env.NEXT_PUBLIC_API_KEY;
//   config.headers["Accept-Language"] = "ar";

//   return config;
// });

// export default api;



