import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdmin } from "@/types/admins";
import {
  ActFetchAdmins,
  ActDeleteAdmin,
  ActToggleAdminStatus,
} from "./thunkActions/ActAdmins";
import { ActCreateAdmin } from "./thunkActions/ActCreateAdmins";
import { ActUpdateAdmin } from "./thunkActions/ActUpdateAdmin";
import { ActFetchAdminById } from "./thunkActions/ActFetchAdminById";

interface AdminsState {
  list: IAdmin[];
  selected: IAdmin | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminsState = {
  list: [],
  selected: null,
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
      state.selected = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /** ================= FETCH LIST ================= */
      .addCase(ActFetchAdmins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        ActFetchAdmins.fulfilled,
        (state, action: PayloadAction<IAdmin[]>) => {
          state.status = "succeeded";
          state.list = action.payload;
        }
      )
      .addCase(ActFetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch admins";
      })

      /** ================= FETCH BY ID ================= */
      .addCase(ActFetchAdminById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        ActFetchAdminById.fulfilled,
        (state, action: PayloadAction<IAdmin>) => {
          state.status = "succeeded";
          state.selected = action.payload;
        }
      )
      .addCase(ActFetchAdminById.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch admin";
      })

      /** ================= CREATE ================= */
      .addCase(ActCreateAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        ActCreateAdmin.fulfilled,
        (state, action: PayloadAction<IAdmin>) => {
          state.status = "succeeded";
          state.list.unshift(action.payload);
        }
      )
      .addCase(ActCreateAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to create admin";
      })

      /** ================= UPDATE ================= */
      .addCase(ActUpdateAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        ActUpdateAdmin.fulfilled,
        (state, action: PayloadAction<IAdmin>) => {
          state.status = "succeeded";

          // update selected
          state.selected = action.payload;

          // sync table list
          state.list = state.list.map((a) =>
            a.id === action.payload.id ? action.payload : a
          );
        }
      )
      .addCase(ActUpdateAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update admin";
      })

      /** ================= DELETE ================= */
      // .addCase(
      //   ActDeleteAdmin.fulfilled,
      //   (state, action: PayloadAction<number>) => {
      //     state.list = state.list.filter((a) => a.id !== action.payload);
      //   }
      // )
      // .addCase(ActDeleteAdmin.rejected, (state, action) => {
      //   state.error =
      //     (action.payload as string) ||
      //     action.error.message ||
      //     "Failed to delete admin";
      // })

      /** ================= TOGGLE ================= */
      .addCase(
        ActToggleAdminStatus.fulfilled,
        (state, action: PayloadAction<IAdmin>) => {
          state.list = state.list.map((a) =>
            a.id === action.payload.id ? action.payload : a
          );

          if (state.selected?.id === action.payload.id) {
            state.selected = action.payload;
          }
        }
      )
      .addCase(ActToggleAdminStatus.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update admin status";
      });
  },
});

export const { clearAdminsError, resetAdmins } = adminsSlice.actions;
export default adminsSlice.reducer;











// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { IAdmin } from "@/types/admins";
// import { ActFetchAdmins, ActDeleteAdmin, ActToggleAdminStatus } from "./thunkActions/ActAdmins";
// import { ActCreateAdmin } from "./thunkActions/ActCreateAdmins";
// import { ActUpdateAdmin } from "./thunkActions/ActUpdateAdmin";
// import { ActFetchAdminById } from "./thunkActions/ActFetchAdminById";

// interface AdminsState {
//   list: IAdmin[];
//   selected: IAdmin | null;   // ✅ REQUIRED
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;

// }

// const initialState: AdminsState = {
//   list: [],
//   selected: null,
//   status: "idle",
//   error: null,
// };

// const adminsSlice = createSlice({
//   name: "admins",
//   initialState,
//   reducers: {
//     clearAdminsError(state) {
//       state.error = null;
//     },
//     resetAdmins(state) {
//       state.list = [];
//       state.status = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(ActFetchAdmins.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(ActFetchAdmins.fulfilled, (state, action: PayloadAction<IAdmin[]>) => {
//         state.status = "succeeded";
//         state.list = action.payload;
//       })
//       .addCase(ActFetchAdmins.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = (action.payload as string) || action.error?.message || "Failed to fetch admins";
//       })

//       .addCase(ActDeleteAdmin.fulfilled, (state, action: PayloadAction<number>) => {
//         state.list = state.list.filter((a) => a.id !== action.payload);
//       })
//       .addCase(ActDeleteAdmin.rejected, (state, action) => {
//         state.error = (action.payload as string) || action.error?.message || "Failed to delete admin";
//       })

//       .addCase(ActToggleAdminStatus.fulfilled, (state, action: PayloadAction<IAdmin>) => {
//         state.list = state.list.map((a) => (a.id === action.payload.id ? action.payload : a));
//       })
//       .addCase(ActToggleAdminStatus.rejected, (state, action) => {
//         state.error = (action.payload as string) || action.error?.message || "Failed to update admin status";
//       })
//       //create admins 
//       .addCase(ActCreateAdmin.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(ActCreateAdmin.fulfilled, (state, action: PayloadAction<IAdmin>) => {
//         state.status = "succeeded";
//         state.list.unshift(action.payload); // add new admin to table
//       })
//       .addCase(ActCreateAdmin.rejected, (state, action) => {
//         state.status = "failed";
//         state.error =
//           (action.payload as string) ||
//           action.error?.message ||
//           "Failed to create admin";
//       })
//       // fetch by id
//       .addCase(ActFetchAdminById.pending, (state) => {
//         state.status = "loading";
//       })
      
//       .addCase(ActFetchAdminById.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.selected = action.payload;
//       })
      
//       .addCase(ActFetchAdminById.rejected, (state) => {
//         state.status = "failed";
//       })
      

//         // update admin
//         .addCase(ActUpdateAdmin.pending, (state) => {
//           state.status = "loading";
//         })
//         .addCase(ActUpdateAdmin.fulfilled, (state, action) => {
//           state.status = "succeeded";
//           state.selected = action.payload;
//         })
//         .addCase(ActUpdateAdmin.rejected, (state, action) => {
//           state.status = "failed";
//           state.error = action.payload as string;
//         })

//       // //update admin
//       // .addCase(ActUpdateAdmin.pending, (state) => {
//       //   state.status = "loading";
//       // })
//       // .addCase(ActUpdateAdmin.fulfilled, (state ) => {
//       //   state.status = "succeeded";
//       // })
//       // .addCase(ActUpdateAdmin.rejected, (state) => {
//       //   state.status = "failed";
//       // })
    
//       //delete admin
//       // delete admin
//       // .addCase(ActDeleteAdmin.pending, (state) => {
//       //   state.status = "loading";
//       // })
//       // .addCase(ActDeleteAdmin.fulfilled, (state) => {
//       //   state.status = "succeeded";
//       // })
//       // .addCase(ActDeleteAdmin.rejected, (state) => {
//       //   state.status = "failed";
//       // });

//       // // TOGGLE
//       // .addCase(ActToggleAdminStatus.fulfilled, (state, action) => {
//       //   state.list = state.list.map(a =>
//       //   a.id === action.payload.id ? action.payload : a
//       // );
//       // })
      
//   },
// });

// export const { clearAdminsError, resetAdmins } = adminsSlice.actions;
// export default adminsSlice.reducer;