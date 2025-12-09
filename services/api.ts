
// src/services/api.ts
import axios from "axios";
import Cookies from "js-cookie";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// main api instance
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

// separate instance for sanctum csrf cookie
export const sanctumApi = axios.create({
  baseURL: BASE,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const getCSRFTokenFromDocument = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith("XSRF-TOKEN="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

// Single request interceptor: attach token + language + api-key + CSRF for mutating requests
api.interceptors.request.use(
    (config) => {
     config.headers = config.headers || {};

  // attach token from cookie at request time
  if (typeof window !== "undefined") {

    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // ensure no stale header
        // if ("Authorization" in config.headers) delete (config.headers as any).Authorization;
        if (config.headers && "Authorization" in config.headers) {
          delete config.headers.Authorization;
        }
    }
    // // language header
    // const pathname = window.location.pathname || "";
    // const lang = pathname.startsWith("/en") ? "en" : "ar";
    // config.headers = config.headers || {};
    // config.headers["Accept-Language"] = lang;
  }


  // api-key always
  config.headers = config.headers || {};
  if (API_KEY) config.headers["api-key"] = API_KEY;

  // CSRF for mutating methods
  const method = (config.method || "").toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const csrf = getCSRFTokenFromDocument();
    if (csrf) config.headers["X-XSRF-TOKEN"] = csrf;
  }

  return config;
}, (err) => Promise.reject(err));

// response interceptor: handle CSRF refresh automatically (no redirect/clear here)

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    // Handle CSRF refresh (status 419)
    if (status === 419 && !error.config._retry) {
      try {
        error.config._retry = true;
        await sanctumApi.get("/sanctum/csrf-cookie");
        const csrf = getCSRFTokenFromDocument();
        if (csrf) {
          error.config.headers["X-XSRF-TOKEN"] = csrf;
        }
        return api.request(error.config);
      } catch (e) {
        console.error("Failed to refresh CSRF token:", e);
      }
    }

    // leave 401 handling to callers / global UI (do not redirect here)
    return Promise.reject(error);
  }
);

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



