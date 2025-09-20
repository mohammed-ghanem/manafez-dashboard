// src/store/cart/cartThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IProduct } from "@/types/product";

// Simulate API delay
const fakeApi = <T>(data: T, delay = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// Add to Cart
export const addToCartThunk = createAsyncThunk(
  "cart/addToCartThunk",
  async (product: IProduct) => {
    return await fakeApi(product); // Replace with real API later
  }
);

// Remove from Cart
export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCartThunk",
  async (id: number) => {
    return await fakeApi(id);
  }
);

// Set Quantity
export const setQuantityThunk = createAsyncThunk(
  "cart/setQuantityThunk",
  async ({ id, quantity }: { id: number; quantity: number }) => {
    return await fakeApi({ id, quantity });
  }
);

// Clear Cart
export const clearCartThunk = createAsyncThunk("cart/clearCartThunk", async () => {
  return await fakeApi(true);
});
