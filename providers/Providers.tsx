// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { hydrateAuthFromCookies } from "@/store/auth/authSlice";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate auth from cookies when component mounts (client-side only)
    store.dispatch(hydrateAuthFromCookies());
  }, []);

  return (
    <Provider store={store}>
      {children}
      <Toaster richColors position="top-right"/>
    </Provider>
  );
}



// "use client"; // This is important!

// import { Provider } from "react-redux";
// import { persistor, store } from "../store/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { Toaster } from "sonner";

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>

//     <PersistGate loading={null} persistor={persistor}>
//       {children}
//       <Toaster richColors position="top-right"/>
//     </PersistGate>

//   </Provider>;
// }
