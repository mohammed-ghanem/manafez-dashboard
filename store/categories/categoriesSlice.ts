import { createSlice } from "@reduxjs/toolkit";
import ActCategories from "./thunkActions/ActCategories";

interface ICategories {
    record: { id: number; name: string ; image: string }[];
    loading: "idle" | "pending" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ICategories = {
    record: [],
    loading: "idle",
    error: null
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        categoriesCleanRecord: (state) => {
            state.record = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(ActCategories.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(ActCategories.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.record = action.payload;
            })
            .addCase(ActCategories.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload as string;
            });
    }
});
export const { categoriesCleanRecord } = categoriesSlice.actions;
export { ActCategories };
export default categoriesSlice.reducer;
