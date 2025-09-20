/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const ActProducts = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId: number, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/categories/${categoryId}/products`
      );
      return response.data;
    }  catch (error : any) {
           if (error.response && error.response.data?.message) {
            return rejectWithValue(error.response.data.message);
           }
           return rejectWithValue("failed to fetch categories");
        }
  }
);

export default ActProducts;
