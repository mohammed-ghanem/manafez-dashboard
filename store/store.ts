// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { privacyPolicyApi } from "./settings/privacyPolicyApi";
import { adminsApi } from "./admins/adminsApi";
import { rolesApi } from "./roles/rolesApi";
import { permissionsApi } from "./permissions/permissionsApi";



export const store = configureStore({
  reducer: {
    auth: authReducer,

    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      privacyPolicyApi.middleware , 
      adminsApi.middleware,
      rolesApi.middleware,
      permissionsApi.middleware
      ),
   
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;