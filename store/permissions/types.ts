export interface Permission {
  id: number;
  name: string;
  key: string;        // e.g. "roles.create"
}

export interface PermissionState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}
