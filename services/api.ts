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
    "Api-Version": "v1", 

  },
});

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
    await axios.get(`${BASE}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
      }
    });

    // Verify the token was set
    const newToken = getCSRFToken();

    if (!newToken) {
      throw new Error('CSRF token not set after refresh');
    }
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
    throw error;
  }
};

// SINGLE COMBINED request interceptor
api.interceptors.request.use(
  (config) => {
    // 🔹 1. Set Accept-Language dynamically based on route
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;

      let lang = "ar"; // default
      if (pathname.startsWith("/ar")) lang = "ar";
      else if (pathname.startsWith("/en")) lang = "en";

      config.headers["Accept-Language"] = lang;
    }

    // 🔹 2. Add CSRF token for mutating requests
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(
      config.method?.toLowerCase() || ''
    );

    if (isMutating) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }

    // 🔹 3. Ensure API key is set
    if (API_KEY) {
      config.headers['api-key'] = API_KEY;
    }

    console.log(`➡️ API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      language: config.headers["Accept-Language"],
      hasCSRF: !!config.headers['X-XSRF-TOKEN'],
      hasAPIKey: !!config.headers['api-key']
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response Success: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`❌ API Response Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);

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

export default api;