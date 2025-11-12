// src/store/roles/types.ts
export type Permission = {
  id: number;
  name: string;
  description?: string;
};

export type Role = {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
};

export type RoleState = {
  roles: Role[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentRole: Role | null;
};