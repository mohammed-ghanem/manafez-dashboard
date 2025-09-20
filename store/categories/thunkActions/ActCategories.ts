/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


 const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, thunkAPI) => {
        const {rejectWithValue} = thunkAPI
        try {
            const response = await axios.get("https://api.escuelajs.co/api/v1/categories");
            return response.data;
        } catch (error : any) {
           if (error.response && error.response.data?.message) {
            return rejectWithValue(error.response.data.message);
           }
           return rejectWithValue("failed to fetch categories");
        }
    }
)

export default fetchCategories