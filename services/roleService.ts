// // updates only: createRole payload shape to match backend expectation
// import api from "./api";
// export interface CreateRoleData {
//   name: string;            // internal name / slug (if needed)
//   name_ar: string;         // Arabic label
//   name_en: string;         // English label
//   description?: string;
//   permissions?: (number | string)[]; // client-facing selected permission ids or keys
//   role_permissions?: (number | string)[]; // allow either
//   is_active?: boolean;
// }

// const roleService = {
//   getRoles: () => api.get("/roles"),
//   getRole: (id: number) => api.get(`/roles/${id}`),

//   createRole: (data: CreateRoleData) =>
//     api.post("/roles", {
//       // send `name` as nested object (API expects name.ar/name.en)
//       name: {
//         ar: data.name_ar,
//         en: data.name_en,
//       },
//       description: data.description || "",
//       is_active: typeof data.is_active === "undefined" ? true : data.is_active,
//       // backend requires role_permissions (IDs). We prefer role_permissions prop if passed,
//       // otherwise use permissions fallback.
//       role_permissions: data.role_permissions ?? data.permissions ?? [],
//     }),

//   updateRole: (id: number, data: Partial<CreateRoleData>) =>
//     api.put(`/roles/${id}`, {
//       // For update keep flexible: if nested name required, pass it:
//       ...(data.name_ar || data.name_en ? {
//         name: {
//           ar: data.name_ar ?? '',
//           en: data.name_en ?? ''
//         }
//       } : {}),
//       description: data.description,
//       permissions: data.permissions,
//     }),

//   deleteRole: (id: number) => api.delete(`/roles/${id}`),
// };

// export default roleService;