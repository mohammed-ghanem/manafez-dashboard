import { createSlice } from "@reduxjs/toolkit";
import { ActFetchRoleById } from "./thunkActions/ActFetchRoleById";
import { ActUpdateRole } from "./thunkActions/ActUpdateRole";
import { ActFetchRoles } from "./thunkActions/ActFetchRoles";
import { ActFetchPermissions } from "../permissions/thunkActions";
import { RolesState, Role } from "./types";

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  status: "idle",
  operationStatus: "idle",
  error: null,
  operationError: null,
  loading: false,
  singleLoading: false,
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(ActFetchRoles.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(ActFetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.roles = action.payload as Role[];
      })
      .addCase(ActFetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch one
      .addCase(ActFetchRoleById.pending, (state) => {
        state.singleLoading = true;
      })
      .addCase(ActFetchRoleById.fulfilled, (state, action) => {
        state.singleLoading = false;
        state.selectedRole = action.payload as Role;
      })
      .addCase(ActFetchRoleById.rejected, (state, action) => {
        state.singleLoading = false;
        state.error = action.payload as string;
      })

      // Update role
      .addCase(ActUpdateRole.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(ActUpdateRole.fulfilled, (state) => {
        state.operationStatus = "success";
      })
      .addCase(ActUpdateRole.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.operationError = action.payload as string;
      })

      // Fetch permissions
      .addCase(ActFetchPermissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ActFetchPermissions.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(ActFetchPermissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default rolesSlice.reducer;






// import { createSlice } from "@reduxjs/toolkit";
// import { ActFetchRoleById } from "./thunkActions/ActFetchRoleById";
// import { ActUpdateRole } from "./thunkActions/ActUpdateRole";
// import { ActFetchRoles } from "./thunkActions/ActFetchRoles";
// import { ActFetchPermissions } from "../permissions/thunkActions";

// export interface Permission {
//   id: number;
//   name: string;
// }

// export interface Role {
//   id: number;
//   name: string;
//   name_en: string;
//   name_ar: string;
//   permissions: Permission[];
// }

// interface RolesState {
//   roles: Role[];
//   selectedRole: Role | null;
//   status: string;
//   operationStatus: string;
//   error: string | null;
//   operationError: string | null;

//   // loading flags
//   loading: boolean;
//   singleLoading: boolean;
// }

// const initialState: RolesState = {
//   roles: [],
//   selectedRole: null,
//   status: "",
//   operationStatus: "",
//   error: null,
//   operationError: null,
//   loading: false,
//   singleLoading: false,
// };

// export const rolesSlice = createSlice({
//   name: "roles",
//   initialState,
//   reducers: {},

//   extraReducers: (builder) => {
//     // Fetch all roles
//     builder.addCase(ActFetchRoles.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(ActFetchRoles.fulfilled, (state, action) => {
//       state.loading = false;
//       state.roles = action.payload;
//     });
//     builder.addCase(ActFetchRoles.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });

//     // Fetch single role
//     builder.addCase(ActFetchRoleById.pending, (state) => {
//       state.singleLoading = true;
//     });
//     builder.addCase(ActFetchRoleById.fulfilled, (state, action) => {
//       state.singleLoading = false;
//       state.selectedRole = action.payload;
//     });
//     builder.addCase(ActFetchRoleById.rejected, (state, action) => {
//       state.singleLoading = false;
//       state.error = action.payload as string;
//     });

//     // Update role
//     builder.addCase(ActUpdateRole.pending, (state) => {
//       state.operationStatus = "loading";
//     });
//     builder.addCase(ActUpdateRole.fulfilled, (state) => {
//       state.operationStatus = "success";
//     });
//     builder.addCase(ActUpdateRole.rejected, (state, action) => {
//       state.operationStatus = "failed";
//       state.operationError = action.payload as string;
//     });

//     // Fetch permissions
//     builder.addCase(ActFetchPermissions.pending, (state) => {
//       state.status = "loading";
//     });
//     builder.addCase(ActFetchPermissions.fulfilled, (state, action) => {
//       state.status = "success";
//     });
//     builder.addCase(ActFetchPermissions.rejected, (state, action) => {
//       state.status = "failed";
//       state.error = action.payload as string;
//     });
//   },
// });

// export default rolesSlice.reducer;








// import { createSlice } from "@reduxjs/toolkit";
// import { Role } from "./types";
// import { ActFetchRoles } from "./thunkActions/ActFetchRoles";


// interface RolesState {
//   roles: Role[];
//   selectedRole: Role | null;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   operationStatus: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
//   operationError: string | null;
// }

// const initialState: RolesState = {
//   roles: [],
//   selectedRole: null,
//   status: "idle",
//   operationStatus: "idle",
//   error: null,
//   operationError: null,
// };


// const rolesSlice = createSlice({
//   name: "roles",
//   initialState: { data: [], loading: false },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(ActFetchRoles.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(ActFetchRoles.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(ActFetchRoles.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });





// export default rolesSlice.reducer;