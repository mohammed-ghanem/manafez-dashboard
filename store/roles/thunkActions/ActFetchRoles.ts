/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const { token } = getState().auth;
      if (!token) return rejectWithValue("Authentication required");

      const response = await api.get("/dashboard-api/v1/roles");
      
      const rolesData = extractRolesFromResponse(response.data);
      
      if (rolesData.length === 0) {
        console.warn('No roles found in API response');
        return [];
      }

      return removeDuplicateRoles(rolesData);

    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Extract roles from various API response structures
const extractRolesFromResponse = (responseData: any): Role[] => {
  if (!responseData) return [];

  // Handle nested data structure: { data: array } with potential nested data arrays
  if (Array.isArray(responseData.data)) {
    return responseData.data.flatMap(extractRolesFromItem);
  }
  
  // Handle direct array of roles
  if (Array.isArray(responseData)) {
    return responseData;
  }
  
  // Handle roles property
  if (Array.isArray(responseData.roles)) {
    return responseData.roles;
  }
  
  // Handle single role objects
  if (responseData.data && typeof responseData.data === 'object') {
    return [responseData.data];
  }
  
  if (responseData.id) {
    return [responseData];
  }

  return [];
};

// Extract roles from individual items that might contain nested data
const extractRolesFromItem = (item: any): Role[] => {
  // If item has nested data array, extract all roles from it
  if (item.data && Array.isArray(item.data)) {
    return item.data.map((nestedRole : any) => ({
      ...nestedRole,
      id: nestedRole.id || item.id // Fallback to parent ID
    }));
  }
  
  // If item is a valid role, use it directly
  if (isValidRole(item)) {
    return [item];
  }
  
  return [];
};

// Check if object has basic role structure
const isValidRole = (item: any): boolean => {
  return item?.id && (item.name || item.name_ar || item.name_en || item.slug);
};

// Remove duplicate roles based on ID
const removeDuplicateRoles = (roles: Role[]): Role[] => {
  const uniqueRoles = roles.filter((role, index, self) => 
    index === self.findIndex(r => r.id === role.id)
  );
  
  console.log(`Loaded ${uniqueRoles.length} unique roles`);
  return uniqueRoles;
};

// Centralized error message handling
const getErrorMessage = (error: any): string => {
  // HTTP status based errors
  if (error.response?.status) {
    const statusMessages: Record<number, string> = {
      401: "Authentication failed - Please login again",
      403: "You don't have permission to view roles",
      404: "Roles endpoint not found",
      500: "Server error - Please try again later",
    };
    
    return statusMessages[error.response.status] || `Server error: ${error.response.status}`;
  }

  // Extract message from various error formats
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Failed to load roles"
  );
};