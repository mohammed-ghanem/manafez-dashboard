import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IProduct } from "@/types/product";
import type { RootState } from "@/store/store";
import {
  addToCartThunk,
  removeFromCartThunk,
  setQuantityThunk,
  clearCartThunk,
} from "./thunkActions/ActCart";

interface IcartSlice {
  items: Record<number, IProduct>;
  productFullInfo: Record<number, IProduct>;
  loading: boolean;
  error: string | null;
}

const initialState: IcartSlice = {
  items: {},
  productFullInfo: {},
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {}, // 👈 local reducers are no longer needed, we’ll use thunks
  extraReducers: (builder) => {
    // ADD TO CART
    builder.addCase(addToCartThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCartThunk.fulfilled, (state, action: PayloadAction<IProduct>) => {
      state.loading = false;
      const p = action.payload;
      const id = p.id;
      const existing = state.items[id];
      if (existing) {
        existing.quantity = (existing.quantity ?? 1) + (p.quantity ?? 1);
      } else {
        state.items[id] = { ...p, quantity: p.quantity ?? 1 };
        state.productFullInfo[id] = { ...p };
      }
    });
    builder.addCase(addToCartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to add item";
    });

    // REMOVE FROM CART
    builder.addCase(removeFromCartThunk.fulfilled, (state, action: PayloadAction<number>) => {
      const id = action.payload;
      delete state.items[id];
      delete state.productFullInfo[id];
    });

    // SET QUANTITY
    builder.addCase(setQuantityThunk.fulfilled, (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.items[id];
        delete state.productFullInfo[id];
      } else {
        if (state.items[id]) state.items[id].quantity = quantity;
      }
    });

    // CLEAR CART
    builder.addCase(clearCartThunk.fulfilled, (state) => {
      state.items = {};
      state.productFullInfo = {};
    });
  },
});

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalQuantity = (state: RootState) =>
  Object.values(state.cart.items).reduce(
    (total, item) => total + (item.quantity ?? 1),
    0
  );

export default cartSlice.reducer;