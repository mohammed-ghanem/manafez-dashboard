// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import rolesReducer from "./roles/rolesSlice";
import permissionsReducer from "./permissions/permissionsSlice";
import adminsReducer from "./admins/adminsSlice";
import { settingsReducer } from "./settingPages";


import { privacyPolicyApi } from "./settings/privacyPolicyApi";
import { adminsApi } from "./admins/adminsApi";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    admins: adminsReducer,
    settings: settingsReducer,

    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
  },
//   middleware: (getDefaultMiddleware) =>

//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),

// });

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      privacyPolicyApi.middleware , 
      adminsApi.middleware),
   
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;