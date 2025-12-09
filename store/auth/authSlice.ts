// store/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ActLogin,
  ActLogout,
  // ActSendResetCode,
  // ActVerifyCode,
  // ActResetPassword
} from "./thunkActions/ActAuth";
import { ActFetchProfile, ActUpdateProfile } from "./thunkActions/ActUser";
import Cookies from "js-cookie";

interface IUser {
  id?: number;
  name?: string;
  email?: string;
  image?: string;
  mobile?: string;
  roles?: string;
}

interface IAuthState {
  user: IUser | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  resetMessage: string | null;
  isHydrated: boolean; // New flag to track hydration
}

// Initialize state with values from cookies if they exist (client-side only)
const getInitialState = (): IAuthState => {
  if (typeof window === "undefined") {
    // Server-side: empty state
    return {
      user: null,
      token: null,
      status: "idle",
      error: null,
      resetMessage: null,
      isHydrated: false,
    };
  }

  // Client-side: try to get from cookies
  try {
    const token = Cookies.get("access_token") || null;
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;
    
    return {
      user,
      token,
      status: "idle",
      error: null,
      resetMessage: null,
      isHydrated: true, // Mark as hydrated since we checked cookies
    };
  } catch (error) {
    console.error("Error reading auth cookies:", error);
    return {
      user: null,
      token: null,
      status: "idle",
      error: null,
      resetMessage: null,
      isHydrated: true,
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearResetMessage: (state) => {
      state.resetMessage = null;
    },
    resetAuthState: () => getInitialState(),
    // New: Sync auth state from cookies (to be called on app mount)
    hydrateAuthFromCookies: (state) => {
      if (typeof window === "undefined") return;
      
      try {
        const token = Cookies.get("access_token") || null;
        const userCookie = Cookies.get("user");
        const user = userCookie ? JSON.parse(userCookie) : null;
        
        state.token = token;
        state.user = user;
        state.isHydrated = true;
      } catch (error) {
        console.error("Error hydrating auth from cookies:", error);
      }
    },
    // New: Manually set auth (for login success)
    setAuth: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "succeeded";
      state.error = null;
      
      // Store in cookies
      if (typeof window !== "undefined") {
        Cookies.set("access_token", action.payload.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(action.payload.user), { expires: 7 });
      }
    },
    // New: Clear auth (for logout)
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      
      if (typeof window !== "undefined") {
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("user", { path: "/" });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔐 Login - Updated to use cookies
      .addCase(ActLogin.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(
        ActLogin.fulfilled,
        (s, a: PayloadAction<{ user: IUser; token: string; message?: string }>) => {
          s.status = "succeeded";
          s.user = a.payload.user;
          s.token = a.payload.token;
          s.error = null;
          
          // Store in cookies
          if (typeof window !== "undefined") {
            Cookies.set("access_token", a.payload.token, { expires: 7 });
            Cookies.set("user", JSON.stringify(a.payload.user), { expires: 7 });
          }
        }
      )
      .addCase(ActLogin.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || a.error?.message || "Login failed";
      })

      // 🚪 Logout - Updated to clear cookies
      .addCase(ActLogout.fulfilled, (s) => {
        s.user = null;
        s.token = null;
        s.status = "idle";
        s.error = null;
        
        if (typeof window !== "undefined") {
          Cookies.remove("access_token", { path: "/" });
          Cookies.remove("user", { path: "/" });
        }
      })

      // ... rest of your extraReducers remain the same
  }
});

export const { 
  clearAuthError, 
  clearResetMessage, 
  resetAuthState, 
  hydrateAuthFromCookies,
  setAuth,
  clearAuth 
} = authSlice.actions;
export default authSlice.reducer;









// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* store/auth/authSlice.ts */
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {
//   ActLogin,
//   ActLogout,
//   ActSendResetCode,
//   ActVerifyCode,
//   ActResetPassword
// } from "./thunkActions/ActAuth";
// import { ActFetchProfile, ActUpdateProfile } from "./thunkActions/ActUser";
 
// interface IUser {
//   id?: number;
//   name?: string;
//   email?: string;
//   image?: string;
//   mobile?: string;
//   roles?: string;
// }
 
// interface IAuthState {
//   user: IUser | null;
//   token: string | null;
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
//   resetMessage: string | null;
// }

// const initialState: IAuthState = {
//   user: null,
//   token: null,
//   status: "idle",
//   error: null,
//   resetMessage: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     clearAuthError: (state) => {
//       state.error = null;
//     },
//     clearResetMessage: (state) => {
//       state.resetMessage = null;
//     },
//     resetAuthState: () => initialState, // ✅ new reducer to reset everything
//   },
//   extraReducers: (builder) => {
//     builder
//       // 🔐 Login
//       .addCase(ActLogin.pending, (s) => {
//         s.status = "loading";
//         s.error = null;
//       })
//       .addCase(
//         ActLogin.fulfilled,
//         (s, a: PayloadAction<{ user: IUser; token: string }>) => {
//           s.status = "succeeded";
//           s.user = a.payload.user;
//           s.token = a.payload.token;
//         }
//       )
//       .addCase(ActLogin.rejected, (s, a) => {
//         s.status = "failed";
//         s.error = (a.payload as string) || a.error?.message || "Login failed";
//       })

//       // 🚪 Logout
//       .addCase(ActLogout.fulfilled, () => initialState)

//       // 📧 Send Reset Code
//       .addCase(ActSendResetCode.pending, (s) => {
//         s.status = "loading";
//         s.error = null;
//         s.resetMessage = null;
//       })
//       .addCase(ActSendResetCode.fulfilled, (s, a) => {
//         s.status = "succeeded";
//         s.resetMessage = a.payload?.message || "Code sent";
//       })
//       .addCase(ActSendResetCode.rejected, (s, a) => {
//         s.status = "failed";
//         s.error = (a.payload as string) || a.error?.message || "Failed to send code";
//       })

//       // ✅ Verify Code
//       .addCase(ActVerifyCode.pending, (s) => {
//         s.status = "loading";
//         s.error = null;
//       })
//       .addCase(ActVerifyCode.fulfilled, (s, a) => {
//         s.status = "succeeded";
//         s.resetMessage = a.payload?.message || "Code verified";
//       })
//       .addCase(ActVerifyCode.rejected, (s, a) => {
//         s.status = "failed";
//         s.error = (a.payload as string) || a.error?.message || "Verification failed";
//       })

//       // 🔑 Reset Password
//       .addCase(ActResetPassword.pending, (s) => {
//         s.status = "loading";
//         s.error = null;
//       })
//       .addCase(ActResetPassword.fulfilled, (s, a) => {
//         s.status = "succeeded";
//         s.resetMessage = a.payload?.message || "Password reset succeeded";
//       })
//       .addCase(ActResetPassword.rejected, (s, a) => {
//         s.status = "failed";
//         s.error = (a.payload as string) || a.error?.message || "Reset failed";
//       })
//       // 👤 Get Profile
//       .addCase(ActFetchProfile.pending, (s) => {
//         s.status = "loading";
//         s.error = null;
//       })
//       .addCase(ActFetchProfile.fulfilled, (s, a) => {
//         s.status = "succeeded";
//         s.user = (a.payload as any)?.user || (a.payload as any)?.data || a.payload;
//         s.error = null;
//       })
//       .addCase(ActFetchProfile.rejected, (s, a) => {
//         s.status = "failed";
//         s.error = (a.payload as string) || a.error?.message || "Failed to fetch profile";
//       })

//       // ✏️ Update Profile
//       .addCase(ActUpdateProfile.pending, (s) => {
//         s.status = "loading";
//         s.error = null;
//       })
//       .addCase(ActUpdateProfile.fulfilled, (s, a) => {
//         s.status = "succeeded";

//         // Extract updated user info safely (handle both response structures)
//         const updatedUser =
//           (a.payload as { user?: IUser; data?: IUser })?.user ||
//           (a.payload as { data?: IUser })?.data ||
//           (a.payload as IUser);

//         // Merge new data with existing user to keep unchanged fields
//         s.user = { ...s.user, ...updatedUser };
//         s.error = null;
//       })
//       .addCase(ActUpdateProfile.rejected, (s, a) => {
//         s.status = "failed";
//         s.error =
//           (a.payload as string) || a.error?.message || "Failed to update profile";
//       });

//   }
// });

// export const { clearAuthError, clearResetMessage, resetAuthState } = authSlice.actions;
// export default authSlice.reducer;