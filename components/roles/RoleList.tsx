// src/components/roles/RoleList.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions";
import { clearError } from "@/store/roles/rolesSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Plus, Edit, Trash2, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RoleList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roles, status, error } = useAppSelector((state) => state.roles);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(ActFetchRoles());
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 10000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRetry = useCallback(() => dispatch(ActFetchRoles()), [dispatch]);

  // Extract all role data from nested arrays
  const getAllRoleData = (role: any) => {
    return role.data && Array.isArray(role.data) ? role.data : [role];
  };

  // Flatten all roles for table display
  const flattenedRoles = roles.flatMap((role) => 
    getAllRoleData(role).map((roleData: any, index: number) => ({
      ...roleData,
      uniqueKey: `${role.id}-${index}`,
    }))
  );

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg font-medium">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center min-h-96 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <CardTitle className="text-xl">Failed to Load Roles</CardTitle>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={handleRetry} className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      <Card className="text-center">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Roles Management</CardTitle>
            <CardDescription>
              {flattenedRoles.length} role{flattenedRoles.length !== 1 ? 's' : ''} found in the system
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </CardHeader>
        <CardContent>
          {flattenedRoles.length > 0 ? (
            <Table className="">
              <TableHeader>
                <TableRow className="rrrrrr">
                  <TableHead>Role</TableHead>
                  <TableHead>Arabic Name</TableHead>
                  <TableHead>English Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flattenedRoles.map((role) => (
                  <TableRow key={role.uniqueKey}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{role.name || "Unnamed"}</div>
                          {role.slug && (
                            <Badge variant="secondary" className="text-xs">
                              {role.slug}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-right" dir="rtl">
                        {role.name_ar || "لا يوجد"}
                      </div>
                    </TableCell>
                    <TableCell>{role.name_en || role.name || "Not set"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions?.length || 0} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {role.created_at}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No roles found</CardTitle>
              <CardDescription className="mb-6">
                There are no roles in the system yet. Create your first role to get started.
              </CardDescription>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Role
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleList;





// "use client";

// import React, { useEffect, useCallback } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchRoles } from "@/store/roles/thunkActions";
// import { clearError } from "@/store/roles/rolesSlice";

// const RoleList: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { roles, status, error } = useAppSelector((state) => state.roles);
//   const { token } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (token) {
//       dispatch(ActFetchRoles());
//     }
//   }, [dispatch, token]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         dispatch(clearError());
//       }, 10000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRetry = useCallback(() => {
//     dispatch(ActFetchRoles());
//   }, [dispatch]);

//   // FIXED: Get ALL role data from nested arrays
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const getAllRoleData = (role: any) => {
//     // If role has nested data array, return ALL items from that array
//     if (role.data && Array.isArray(role.data)) {
//       console.log(`📁 Found ${role.data.length} nested roles in role ${role.id}:`, role.data);
//       return role.data;
//     }
//     // Otherwise return the role itself as a single item array
//     return [role];
//   };

//   // Loading State
//   if (status === "loading") {
//     return (
//       <div className="min-h-96 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 
//                           border-b-2 border-blue-600 mx-auto mb-4">
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (status === "failed") {
//     return (
//       <div className="min-h-96 flex items-center justify-center px-4">
//         <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border border-red-200 p-6">
//           <div className="text-center">
//             <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>

//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Failed to Load Roles
//             </h3>

//             <div className="mb-6">
//               <p className="font-medium text-red-600 bg-red-50 p-3 rounded border border-red-200">
//                 {error}
//               </p>
//             </div>

//             <button
//               onClick={handleRetry}
//               className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success State - FIXED: Use flatMap to handle nested arrays
//   return (
//     <div className="min-h-96">
//       <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Roles Management</h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 {roles.length} role{roles.length !== 1 ? 's' : ''} found
//               </p>
//             </div>
//             <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Role
//             </button>
//           </div>
//         </div>

//         {/* FIXED: Use flatMap to handle nested role data */}
//         <div className="divide-y divide-gray-200">
//           {roles.flatMap((role, roleIndex) => {
//             const allRoleData = getAllRoleData(role);
//             console.log(`🔄 Processing role ${roleIndex}:`, {
//               originalRole: role,
//               extractedRoles: allRoleData.length
//             });

//             return allRoleData.map((roleData , dataIndex )   => (
//               <div key={`${role.id}-${dataIndex}`} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4 flex-1">
//                     <div className="flex-shrink-0">
//                       <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
//                         <span className="text-white font-semibold text-sm">
//                           {roleData.name?.charAt(0)?.toUpperCase() || 'R'}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Role Names in Arabic and English */}
//                     <div className="flex-1 min-w-0">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         {/* Arabic Name */}
//                         <div className="space-y-1">
//                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                             Arabic Name
//                           </label>
//                           <div className="flex items-center space-x-2">
//                             <span className="text-base font-medium text-gray-900" dir="rtl">
//                               {roleData.name_ar || roleData.arabic_name || 'لا يوجد'}
//                             </span>
//                             {(roleData.name_ar || roleData.arabic_name) && (
//                               <span className="text-xs text-gray-400" dir="rtl">
//                                 (العربية)
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* English Name */}
//                         <div className="space-y-1">
//                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                             English Name
//                           </label>
//                           <div className="flex items-center space-x-2">
//                             <span className="text-base font-medium text-gray-900">
//                               {roleData.name_en || roleData.english_name || roleData.name || 'Not set'}
//                             </span>
//                             {(roleData.name_en || roleData.english_name || roleData.name) && (
//                               <span className="text-xs text-gray-400">
//                                 (English)
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Additional Info */}
//                       <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
//                         {/* Slug */}
//                         {roleData.slug && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
//                             <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                             </svg>
//                             {roleData.slug}
//                           </span>
//                         )}

//                         {/* Permissions Count */}
//                         <span className="inline-flex items-center">
//                           <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                           </svg>
//                           {roleData.permissions?.length || 0} permissions
//                         </span>

//                         {/* Created Date */}
//                         {roleData.created_at && (
//                           <span className="inline-flex items-center">
//                             <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             {new Date(roleData.created_at).toLocaleDateString()}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center space-x-2 ml-4">
//                     <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
//                       <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                       Edit
//                     </button>
//                     <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
//                       <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ));
//           })}
//         </div>

//         {/* Empty State */}
//         {roles.length === 0 && status === "succeeded" && (
//           <div className="px-6 py-12 text-center">
//             <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
//             <p className="text-gray-500 mb-6">
//               There are no roles in the system yet.
//             </p>
//             <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               Create First Role
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoleList;