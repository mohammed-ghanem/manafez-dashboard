import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdmin } from "@/types/admins";
import { ActFetchAdmins, ActDeleteAdmin, ActToggleAdminStatus } from "./thunkActions/ActAdmins";
import { ActCreateAdmin } from "./thunkActions/ActCreateAdmins";

interface AdminsState {
  list: IAdmin[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminsState = {
  list: [],
  status: "idle",
  error: null,
};

const adminsSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    clearAdminsError(state) {
      state.error = null;
    },
    resetAdmins(state) {
      state.list = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ActFetchAdmins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(ActFetchAdmins.fulfilled, (state, action: PayloadAction<IAdmin[]>) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(ActFetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error?.message || "Failed to fetch admins";
      })

      .addCase(ActDeleteAdmin.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter((a) => a.id !== action.payload);
      })
      .addCase(ActDeleteAdmin.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error?.message || "Failed to delete admin";
      })

      .addCase(ActToggleAdminStatus.fulfilled, (state, action: PayloadAction<IAdmin>) => {
        state.list = state.list.map((a) => (a.id === action.payload.id ? action.payload : a));
      })
      .addCase(ActToggleAdminStatus.rejected, (state, action) => {
        state.error = (action.payload as string) || action.error?.message || "Failed to update admin status";
      })
      //create admins 
      .addCase(ActCreateAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(ActCreateAdmin.fulfilled, (state, action: PayloadAction<IAdmin>) => {
        state.status = "succeeded";
        state.list.unshift(action.payload); // add new admin to table
      })
      .addCase(ActCreateAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error?.message ||
          "Failed to create admin";
      })
      // // DELETE
      // .addCase(ActDeleteAdmin.fulfilled, (state, action) => {
      //   state.list = state.list.filter(a => a.id !== action.payload);
      // })

      // // TOGGLE
      // .addCase(ActToggleAdminStatus.fulfilled, (state, action) => {
      //   state.list = state.list.map(a =>
      //   a.id === action.payload.id ? action.payload : a
      // );
      // })
      
  },
});

export const { clearAdminsError, resetAdmins } = adminsSlice.actions;
export default adminsSlice.reducer;

