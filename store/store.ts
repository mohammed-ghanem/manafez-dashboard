import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import categoriesReducer from "./categories/categoriesSlice";
import productsReducer from "./products/productsSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import authReducer from "./auth/authSlice";
import rolesReducer from "./roles/rolesSlice";
// Persist config only for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // only save these
};

// Wrap auth reducer with persist
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: persistedAuthReducer, // persisted version
    roles: rolesReducer, // ✅ add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist requires disabling this
    }),
});

// Persistor instance
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;





// import {configureStore} from '@reduxjs/toolkit'
// import categoriesReducer from './categories/categoriesSlice'
// import productsReducer from './products/productsSlice'
// import cartReducer from './cart/cartSlice'
// import wishlistReducer from "./wishlist/wishlistSlice";
// import authReducer from "./auth/authSlice";


// export const store = configureStore({
//     reducer: {
//         categories: categoriesReducer,
//         products: productsReducer,
//         cart: cartReducer,
//         wishlist: wishlistReducer,
//         auth: authReducer,
        
        
//     }
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch