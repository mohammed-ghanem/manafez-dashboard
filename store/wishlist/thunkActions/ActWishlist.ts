import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IProduct } from "@/types/product";

// Simulated API delay
const mockApi = <T>(data: T, timeout = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), timeout));

// ✅ Add to Wishlist
export const actAddToWishlist = createAsyncThunk(
  "wishlist/add",
  async (product: IProduct, { rejectWithValue }) => {
    try {
      const response = await mockApi(product);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to add item to wishlist");
    }
  }
);

// ✅ Remove from Wishlist
export const actRemoveFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await mockApi(productId);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to remove item from wishlist");
    }
  }
);

// ✅ Fetch Wishlist Items
export const actFetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate empty list for now
      const response = await mockApi<IProduct[]>([]);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch wishlist");
    }
  }
);
