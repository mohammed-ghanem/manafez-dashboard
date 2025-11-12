// src/services/roleService.ts
import api from "./api";

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData {
  name: string;
  description?: string;
}

const roleService = {
  getRoles: () => api.get("/roles"),
  getRole: (id: number) => api.get(`/roles/${id}`),
  createRole: (data: CreateRoleData) => api.post("/roles", data),
  updateRole: (id: number, data: UpdateRoleData) => api.put(`/roles/${id}`, data),
  deleteRole: (id: number) => api.delete(`/roles/${id}`),
  assignPermissions: (id: number, permissions: string[]) =>
    api.put(`/roles/${id}/permissions`, { permissions }),
};

export default roleService;