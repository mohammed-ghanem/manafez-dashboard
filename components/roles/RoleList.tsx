"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions";
import { Role } from "@/types/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoleRow from "./RoleRow";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const { roles, loading } = useAppSelector((s) => s.roles);

  useEffect(() => {
    dispatch(ActFetchRoles());
  }, [dispatch]);

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle className="text-lg font-medium">الأدوار</CardTitle>
        </CardHeader>

        <CardContent>
          {loading && <p>تحميل...</p>}

          {!loading && roles.length === 0 && (
            <p className="text-center text-gray-500">لا توجد بيانات.</p>
          )}

          <div className="space-y-4">
            {roles.map((role: any) => (
              <RoleRow key={role.id} role={role} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}









// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/roles/RoleList.tsx
// "use client";

// import React, { useEffect, useCallback } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchRoles } from "@/store/roles/thunkActions";
// import { clearError } from "@/store/roles/rolesSlice";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, AlertCircle, Plus, Edit, Trash2, Users } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// const RoleList: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { roles, status, error } = useAppSelector((state) => state.roles);
//   const { token } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (token) dispatch(ActFetchRoles());
//   }, [dispatch, token]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => dispatch(clearError()), 10000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRetry = useCallback(() => dispatch(ActFetchRoles()), [dispatch]);

//   // Extract all role data from nested arrays
//   const getAllRoleData = (role: any) => {
//     return role.data && Array.isArray(role.data) ? role.data : [role];
//   };

//   // Flatten all roles for table display
//   const flattenedRoles = roles.flatMap((role) => 
//     getAllRoleData(role).map((roleData: any, index: number) => ({
//       ...roleData,
//       uniqueKey: `${role.id}-${index}`,
//     }))
//   );

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
//           <p className="text-lg font-medium">Loading roles...</p>
//         </div>
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <div className="flex items-center justify-center min-h-96 px-4">
//         <Card className="w-full max-w-md">
//           <CardContent className="pt-6">
//             <div className="text-center space-y-4">
//               <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
//               <CardTitle className="text-xl">Failed to Load Roles</CardTitle>
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//               <Button onClick={handleRetry} className="w-full">
//                 Try Again
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 ">
//       <Card className="text-center">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//           <div className="space-y-1">
//             <CardTitle className="text-2xl font-bold">Roles Management</CardTitle>
//             <CardDescription>
//               {flattenedRoles.length} role{flattenedRoles.length !== 1 ? 's' : ''} found in the system
//             </CardDescription>
//           </div>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Role
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {flattenedRoles.length > 0 ? (
//             <Table className="">
//               <TableHeader>
//                 <TableRow className="rrrrrr">
//                   <TableHead>Role</TableHead>
//                   <TableHead>Arabic Name</TableHead>
//                   <TableHead>English Name</TableHead>
//                   <TableHead>Permissions</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {flattenedRoles.map((role) => (
//                   <TableRow key={role.uniqueKey}>
//                     <TableCell>
//                       <div className="flex items-center space-x-3">
//                         <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
//                           <Users className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <div className="font-medium">{role.name || "Unnamed"}</div>
//                           {role.slug && (
//                             <Badge variant="secondary" className="text-xs">
//                               {role.slug}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="text-right" dir="rtl">
//                         {role.name_ar || "لا يوجد"}
//                       </div>
//                     </TableCell>
//                     <TableCell>{role.name_en || role.name || "Not set"}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline">
//                         {role.permissions?.length || 0} permissions
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {role.created_at}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end space-x-2">
//                         <Button variant="outline" size="sm">
//                           <Edit className="h-4 w-4 mr-1" />
//                           Edit
//                         </Button>
//                         <Button variant="destructive" size="sm">
//                           <Trash2 className="h-4 w-4 mr-1" />
//                           Delete
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-12">
//               <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <CardTitle className="text-xl mb-2">No roles found</CardTitle>
//               <CardDescription className="mb-6">
//                 There are no roles in the system yet. Create your first role to get started.
//               </CardDescription>
//               <Button>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create First Role
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default RoleList;



