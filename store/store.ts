import {configureStore} from '@reduxjs/toolkit'
import categoriesReducer from './categories/categoriesSlice'
import productsReducer from './products/productsSlice'
import cartReducer from './cart/cartSlice'
import wishlistReducer from "./wishlist/wishlistSlice";
import authReducer from "./auth/authSlice";


export const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        products: productsReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        auth: authReducer,
        
        
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch