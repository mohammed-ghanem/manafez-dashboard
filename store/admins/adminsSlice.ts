import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdmin } from "@/types/admins";
import { ActFetchAdmins, ActDeleteAdmin, ActToggleAdminStatus } from "./thunkActions/ActAdmins";

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
      });
  },
});

export const { clearAdminsError, resetAdmins } = adminsSlice.actions;
export default adminsSlice.reducer;






// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {ActFetchAdmins} from "./thunkActions/ActAdmins";


// interface IAdminsState {
//     user: IAdmins | null;
//     token: string | null;
//     status: "idle" | "loading" | "succeeded" | "failed";
//     error: string | null;
//     resetMessage: string | null;
//   }

// const initialState: IAdminsState = {
//     user: null,
//     token: null,
//     status: "idle",
//     error: null,
//     resetMessage: null,
//   };

//   interface IAdmins {
//     id?: number;
//     name?: string;
//     email?: string;
//     image?: string;
//     mobile?: string;
//     roles?: string;
//   }


// const adminAuth = createSlice({
//     name: "admins",
//     initialState,
//     reducers: {
//         clearAdminsError: (state) => {
//             state.error = null;
//           },
//           clearResetMessage: (state) => {
//             state.resetMessage = null;
//           },
//           resetAdminsState: () => initialState, // ✅ new reducer to reset everything
//     },
//     extraReducers: (builder) => {
//         builder
//         .addCase(ActFetchAdmins.pending, (state) => {
//             state.status = "loading";
//             state.error = null;
//         })
//         .addCase(
//             ActFetchAdmins.fulfilled,
//             (state, a: PayloadAction<{ user: IAdmins; token: string }>) => {
//                 state.status = "succeeded";
//                 state.user = a.payload.user;
//                 state.token = a.payload.token;
//             }
//         )
//         .addCase(ActFetchAdmins.rejected, (state, a) => {
//             state.status = "failed";
//             state.error = (a.payload as string) || a.error?.message || "Login failed";
//         });
//     },
// });

// export const { clearAdminsError, clearResetMessage, resetAdminsState } = adminAuth.actions;
// export default adminAuth.reducer;