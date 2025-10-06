"use client"; // This is important!

import { Provider } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>

    <PersistGate loading={null} persistor={persistor}>
      {children}
      <Toaster richColors position="top-right"/>
    </PersistGate>

  </Provider>;
}
