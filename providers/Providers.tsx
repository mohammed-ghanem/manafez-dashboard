// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/services/api";
import { setAuthFromClient } from "@/store/auth/authSlice";
import { ActFetchProfile } from "@/store/auth/thunkActions/ActUser";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // read cookie on client and seed redux synchronously
    const token = Cookies.get("access_token") ?? null;
    const userJson = Cookies.get("user") ?? null;
    let user = null;
    try {
      user = userJson ? JSON.parse(userJson) : null;
    } catch {
      user = null;
    }

    // immediately set axios default header (redundant with interceptor but safe)
    if (token) {
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    // hydrate redux so selectors reading state.auth.user get the cookie snapshot
    store.dispatch(setAuthFromClient({ user, token }));

    // fetch fresh profile once (interceptor will attach token)
    if (token) {
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