import { createSlice } from "@reduxjs/toolkit";
import type { IProduct } from "@/types/product";
import {
  actAddToWishlist,
  actRemoveFromWishlist,
  actFetchWishlist,
} from "./thunkActions/ActWishlist";
import type { RootState } from "../store";

interface WishlistState {
  items: IProduct[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ✅ synchronous reducers
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actFetchWishlist.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(actFetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = "succeeded";
      })
      .addCase(actFetchWishlist.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? "Failed to fetch wishlist";
      })
      .addCase(actAddToWishlist.fulfilled, (state, action) => {
        if (!state.items.find((item) => item.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(actRemoveFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

// ✅ Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) =>
  state.wishlist.items.length;






// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { IProduct } from "@/types/product";
// import type { RootState } from "@/store/store";

// interface IWishlistSlice {
//   items: Record<number, IProduct>; // store products by ID
// }

// const initialState: IWishlistSlice = {
//   items: {},
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     addToWishlist(state, action: PayloadAction<IProduct>) {
//       const p = action.payload;
//       if (!state.items[p.id]) {
//         state.items[p.id] = p;
//       }
//     },
//     removeFromWishlist(state, action: PayloadAction<number>) {
//       delete state.items[action.payload];
//     },
//     clearWishlist(state) {
//       state.items = {};
//     },
//   },
// });

// export const { addToWishlist, removeFromWishlist, clearWishlist } =
//   wishlistSlice.actions;

// export const selectWishlistItems = (state: RootState) => state.wishlist.items;
// export const selectWishlistCount = (state: RootState) =>
//   Object.keys(state.wishlist.items).length;

// export default wishlistSlice.reducer;
