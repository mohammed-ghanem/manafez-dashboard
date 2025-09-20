import { createSlice } from "@reduxjs/toolkit";
import ActProducts from "./thunkActions/ActProducts";
import type { IProduct } from "@/types/product";


interface IProductsState {
  record: IProduct[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: IProductsState = {
  record: [],
  loading: "idle",
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    productCleanRecord: (state) => {
      state.record = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(ActProducts.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(ActProducts.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.record = action.payload;
      })
      .addCase(ActProducts.rejected, (state, action) => {
        state.loading = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch products";
      });
  }
});

export const { productCleanRecord } = productsSlice.actions;
export { ActProducts };
export default productsSlice.reducer;
