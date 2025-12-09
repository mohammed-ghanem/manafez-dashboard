// app/providers.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/services/api";
import { hydrateAuthFromCookies } from "@/store/auth/authSlice";
import { ActFetchProfile } from "@/store/auth/thunkActions/ActUser";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1) hydrate redux with any stored cookie user/token
    store.dispatch(hydrateAuthFromCookies());

    // 2) set axios default Authorization immediately (good fallback; interceptor also reads cookie)
    const token = Cookies.get("access_token");
    if (token) {
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // 3) fetch profile once (safe, will include header via interceptor/defaults)
      store.dispatch(ActFetchProfile());
    }
  }, []);

  return (
    <Provider store={store}>
      {children}
      <Toaster richColors position="top-right" />
    </Provider>
  );
}




// // app/providers.tsx
// "use client";

// import { Provider } from "react-redux";
// import { store } from "../store/store";
// import { Toaster } from "sonner";

// export function Providers({ children }: { children: React.ReactNode }) {
 

//   return (
//     <Provider store={store}>
//       {children}
//       <Toaster richColors position="top-right"/>
//     </Provider>
//   );
// }

