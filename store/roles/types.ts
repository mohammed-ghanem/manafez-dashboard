// src/store/roles/types.ts

export interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  slug?: string;
  description?: string;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
  permissions: Permission[];
}

export interface RolesState {
  roles: Role[];
  selectedRole: Role | null;

  status: "idle" | "loading" | "success" | "failed";
  operationStatus: "idle" | "loading" | "success" | "failed";

  error: string | null;
  operationError: string | null;

  loading: boolean;
  singleLoading: boolean;
}







// // src/store/roles/types.ts
// export type Permission = {
//   id: number;
//   name: string;
//   name_ar?: string;
//   name_en?: string;
//   slug?: string;
// };

// export type Role = {
//   id: number;
//   name: string;
//   name_ar?: string;
//   name_en?: string;
//   slug?: string;
//   description?: string;
//   permissions?: Permission[];
//   created_at?: string;
//   updated_at?: string;
//   // Add other fields that your API returns
// };

// export type RoleState = {
//   roles: Role[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
//   currentRole: Role | null;
// };