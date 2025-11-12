// src/store/roles/thunkActions/ActFetchRoles.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import { Role } from "../types";
import { RootState } from "@/store/store";

export const ActFetchRoles = createAsyncThunk<
  Role[], 
  void, 
  { 
    rejectValue: string;
    state: RootState;
  }
>(
  "roles/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('🔄 Starting roles fetch...');
      
      // Get authentication state
      const state = getState();
      const { token, user } = state.auth;
      
      console.log('🔐 Auth state:', { 
        hasToken: !!token,
        tokenLength: token?.length,
        user: user?.email,
        userRoles: user?.roles
      });

      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      console.log('🌐 Making API call to /roles...');
      console.log('📡 Full URL:', `${api.defaults.baseURL}/roles`);
      
      // Make the API call
      const response = await api.get("/roles");
      
      console.log('✅ API Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      // Handle different API response structures
      let rolesData: Role[] = [];
      
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          rolesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          rolesData = response.data;
        } else if (response.data.roles && Array.isArray(response.data.roles)) {
          rolesData = response.data.roles;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          rolesData = response.data.items;
        }
      }
      
      console.log(`📊 Extracted ${rolesData.length} roles:`, rolesData);
      
      if (rolesData.length === 0) {
        console.warn('⚠️ No roles found in response');
      }
      
      return rolesData;

    } catch (error: any) {
      console.error('❌ Roles fetch error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          baseURL: error.config?.baseURL
        }
      });

      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 401:
            return rejectWithValue("Unauthorized - Please check your authentication");
          case 403:
            return rejectWithValue("Forbidden - You don't have permission to view roles");
          case 404:
            return rejectWithValue("Roles endpoint not found (404) - Check if /roles route exists on backend");
          case 500:
            return rejectWithValue("Server error - Backend server issue");
          default:
            const serverMessage = error.response.data?.message 
              || error.response.data?.error
              || `Server error: ${error.response.status}`;
            return rejectWithValue(serverMessage);
        }
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue("No response from server - Check if backend is running");
      } else {
        // Something else happened
        return rejectWithValue(error.message || "Unknown error occurred");
      }
    }
  }
);




// // src/store/roles/thunkActions/ActFetchRoles.ts
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "@/services/api";
// import { Role } from "../types";
// import { RootState } from "@/store/store";

// export const ActFetchRoles = createAsyncThunk<
//   Role[], 
//   void, 
//   { 
//     rejectValue: string;
//     state: RootState;
//   }
// >(
//   "roles/fetchAll",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       console.log('🔄 Starting roles fetch...');
      
//       // Get authentication state
//       const state = getState();
//       const { token, user } = state.auth;
      
//       console.log('🔐 Auth state:', { 
//         isAuthenticated: !!token,
//         user: user?.email,
//         tokenExists: !!token
//       });

//       if (!token) {
//         console.warn('⚠️ No authentication token found');
//         return rejectWithValue("Authentication required");
//       }

//       // Make authenticated request
//       const response = await api.get("/roles", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });
      
//       console.log('✅ Roles fetched successfully:', {
//         status: response.status,
//         dataCount: response.data.data?.length || response.data.length || 0,
//         dataStructure: Object.keys(response.data)
//       });

//       // Handle different API response structures
//       const rolesData = response.data.data || response.data || [];
      
//       if (!Array.isArray(rolesData)) {
//         console.error('❌ Unexpected data format:', rolesData);
//         return rejectWithValue("Invalid data format received from server");
//       }
      
//       console.log(`📊 Loaded ${rolesData.length} roles`);
//       return rolesData;

//     } catch (error: any) {
//       console.error('❌ Roles fetch error:', {
//         message: error.message,
//         status: error.response?.status,
//         statusText: error.response?.statusText,
//         data: error.response?.data,
//         url: error.config?.url
//       });

//       // Handle specific error cases
//       if (error.response?.status === 401) {
//         return rejectWithValue("Authentication failed - Please login again");
//       } else if (error.response?.status === 403) {
//         return rejectWithValue("You don't have permission to view roles");
//       } else if (error.response?.status === 404) {
//         return rejectWithValue("Roles endpoint not found - Please check backend routes");
//       } else if (error.response?.status === 500) {
//         return rejectWithValue("Server error - Please try again later");
//       } else if (error.code === 'NETWORK_ERROR') {
//         return rejectWithValue("Network error - Check your connection");
//       }

//       const errorMessage = error.response?.data?.message 
//         || error.response?.data?.error
//         || error.message 
//         || "Failed to load roles";

//       return rejectWithValue(errorMessage);
//     }
//   }
// );