// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import rolesReducer from "./roles/rolesSlice";
import permissionsReducer from "./permissions/permissionsSlice";
import adminsReducer from "./admins/adminsSlice";
import { settingsReducer } from "./settingPages";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    admins: adminsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;