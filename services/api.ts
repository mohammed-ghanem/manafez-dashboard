// services/api.ts
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";


const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "api-key": API_KEY,
  },
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Only add CSRF token for mutating requests
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '');
    
    if (isMutating) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }

    if (API_KEY) {
      config.headers['apikey'] = API_KEY;
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasCSRF: !!config.headers['X-XSRF-TOKEN'],
      cookies: document.cookie
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response Success: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`API Response Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    
    if (error.response?.status === 419) { // CSRF token mismatch
      console.log('CSRF token mismatch detected, attempting to refresh...');
      
      // Try to get a new CSRF token and retry the request
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

// Helper functions
export const getCSRFToken = (): string | null => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

export const refreshCSRFToken = async (): Promise<void> => {
  try {
    console.log('Refreshing CSRF token...');
    await axios.get(`${BASE}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    // Verify the token was set
    const newToken = getCSRFToken();
    console.log('CSRF token refresh result:', newToken ? 'Success' : 'Failed');
    
    if (!newToken) {
      throw new Error('CSRF token not set after refresh');
    }
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
    throw error;
  }
};

export default api;




// import axios from "axios";

// const BASE = process.env.NEXT_PUBLIC_BASE_URL;
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// const api = axios.create({
//   baseURL: BASE,
//   withCredentials: true, // This is important for cookies
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//     "X-XSRF-TOKEN": "",
//     apikey: API_KEY,
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     // Get CSRF token from cookies
//     const getCookie = (name: string) => {
//       const value = `; ${document.cookie}`;
//       const parts = value.split(`; ${name}=`);
//       if (parts.length === 2) return parts.pop()?.split(';').shift();
//     };

//     const csrfToken = getCookie('XSRF-TOKEN') || getCookie('csrf_token');
    
//     if (csrfToken) {
//       config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
//     }

//     if (API_KEY) {
//       config.headers['apikey'] = API_KEY;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 419) { // CSRF token mismatch
//       // You might want to retry the request after getting a new CSRF token
//       console.error('CSRF token mismatch');
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;




// // services/api.ts
// import axios from "axios";

// const BASE = process.env.NEXT_PUBLIC_BASE_URL;
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// // Create axios instance
// const api = axios.create({
//   baseURL: BASE,
//   withCredentials: true,
//   xsrfCookieName: "XSRF-TOKEN",   // Laravel Sanctum default
//   xsrfHeaderName: "X-XSRF-TOKEN",
// });

// // Add interceptor for auth + csrf
// api.interceptors.request.use((config) => {
//   // CSRF token from cookie
//   const csrfToken = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("XSRF-TOKEN="))
//     ?.split("=")[1];

//   if (csrfToken) {
//     config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
//   }

//   // API key if required
//   if (API_KEY) {
//     config.headers["apikey"] = API_KEY;
//   }

//   return config;
// });

// export default api;





// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
//   withCredentials: true,
//   xsrfCookieName: "XSRF-TOKEN",   // cookie name from backend
//   xsrfHeaderName: "X-XSRF-TOKEN", // header name Laravel expects
//   headers: {
//     apikey: process.env.NEXT_PUBLIC_API_KEY || "",
//   },
// });

// export default api;
