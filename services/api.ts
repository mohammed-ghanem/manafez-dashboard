
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
        if (config.headers && "Authorization" in config.headers) {
          delete config.headers.Authorization;
        }
    }
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