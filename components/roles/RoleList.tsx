// src/components/roles/RoleList.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchRoles } from "@/store/roles/thunkActions";
import { clearError } from "@/store/roles/rolesSlice";

const RoleList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roles, status, error } = useAppSelector((state) => state.roles);
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('🎯 RoleList component mounted');
    console.log('🔐 Current auth:', { 
      hasToken: !!token, 
      user: user?.email 
    });
    
    if (token) {
      console.log('🔄 Dispatching roles fetch...');
      dispatch(ActFetchRoles());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (error) {
      console.log('🚨 Error state updated:', error);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 15000); // Keep error longer for debugging
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRetry = useCallback(() => {
    console.log('🔄 User clicked retry...');
    dispatch(ActFetchRoles());
  }, [dispatch]);

  const testEndpointManually = useCallback(async () => {
    try {
      console.log('🧪 Testing endpoint manually...');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'api-key': process.env.NEXT_PUBLIC_API_KEY || '',
          'Api-Version': 'v1',
        },
      });

      console.log('🧪 Manual test response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      const text = await response.text();
      console.log('🧪 Response body:', text);

      try {
        const jsonData = JSON.parse(text);
        console.log('🧪 Parsed JSON:', jsonData);
      } catch (e) {
        console.log('🧪 Response is not JSON');
      }

      alert(`Manual test completed:\nStatus: ${response.status} ${response.statusText}\nCheck console for details.`);

    } catch (testError: any) {
      console.error('🧪 Manual test failed:', testError);
      alert(`Manual test failed: ${testError.message}\nCheck console for details.`);
    }
  }, [token]);

  // Loading State
  if (status === "loading") {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roles...</p>
          <p className="text-sm text-gray-500 mt-1">
            Authenticated as: <strong>{user?.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  // Error State - Enhanced with more details
  if (status === "failed") {
    return (
      <div className="min-h-96 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border border-red-200 p-6">
          <div className="text-center">
            {/* Header */}
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Roles
            </h3>

            {/* User Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Authenticated as:</strong> {user?.email}
              </p>
              <p className="text-sm text-blue-600">
                <strong>Token:</strong> {token ? `Present (${token.length} chars)` : 'Missing'}
              </p>
            </div>

            {/* Error Message */}
            <div className="mb-6">
              <p className="font-medium text-red-600 bg-red-50 p-3 rounded border border-red-200">
                {error}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              <button
                onClick={testEndpointManually}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Test Endpoint Manually
              </button>
            </div>

            {/* Debug Information */}
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Debug Information:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL}</p>
                <p><strong>Target Endpoint:</strong> {process.env.NEXT_PUBLIC_BASE_URL}/roles</p>
                <p><strong>Request Method:</strong> GET</p>
                <p><strong>Authentication:</strong> {token ? 'Bearer Token Present' : 'No Token'}</p>
                <p><strong>Status:</strong> {status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-96">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Roles Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                {roles.length} role{roles.length !== 1 ? 's' : ''} found
                {user && ` • Authenticated as ${user.email}`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Roles List */}
        <div className="divide-y divide-gray-200">
          {roles.map((role) => (
            <div key={role.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {role.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {role.name}
                    </h3>
                    {role.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {role.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {role.permissions?.length || 0} permissions
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {roles.length === 0 && status === "succeeded" && (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no roles in the system yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleList;








// // src/components/roles/RoleList.tsx
// "use client";

// import React, { useEffect, useCallback } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchRoles } from "@/store/roles/thunkActions";
// import { clearError } from "@/store/roles/rolesSlice";

// const RoleList: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { roles, status, error } = useAppSelector((state) => state.roles);
//   const { token, user } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     console.log('🎯 RoleList mounted - Auth status:', { 
//       hasToken: !!token, 
//       user: user?.email,
//       rolesStatus: status 
//     });
    
//     if (token) {
//       console.log('🔐 Token found, fetching roles...');
//       dispatch(ActFetchRoles());
//     } else {
//       console.warn('⚠️ No authentication token - skipping roles fetch');
//     }
//   }, [dispatch, token, user]);

//   useEffect(() => {
//     if (error) {
//       console.log('🚨 Error in RoleList:', error);
//       const timer = setTimeout(() => {
//         dispatch(clearError());
//       }, 10000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, dispatch]);

//   const handleRetry = useCallback(() => {
//     console.log('🔄 Retrying roles fetch...');
//     dispatch(ActFetchRoles());
//   }, [dispatch]);

//   // Not Authenticated State
//   if (!token) {
//     return (
//       <div className="min-h-96 flex items-center justify-center px-4">
//         <div className="max-w-md w-full bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
//           <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
//             <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
          
//           <h3 className="text-lg font-semibold text-yellow-800 mb-2">
//             Authentication Required
//           </h3>
          
//           <p className="text-yellow-700 mb-4">
//             You need to be logged in to view roles.
//           </p>
          
//           <button
//             onClick={() => window.location.href = '/login'}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Loading State
//   if (status === "loading") {
//     return (
//       <div className="min-h-96 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading roles...</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Authenticated as: {user?.email}
//           </p>
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
            
//             <div className="text-sm text-gray-600 mb-6">
//               <p className="font-medium text-red-600 bg-red-50 p-3 rounded mb-3">{error}</p>
//               <p className="text-xs text-gray-500">
//                 Authenticated as: <strong>{user?.email}</strong>
//               </p>
//             </div>

//             <div className="space-y-3">
//               <button
//                 onClick={handleRetry}
//                 className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Success State
//   return (
//     <div className="min-h-96">
//       <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">Roles Management</h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 {roles.length} role{roles.length !== 1 ? 's' : ''} found
//                 {user && ` • Authenticated as ${user.email}`}
//               </p>
//             </div>
//             <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               Add New Role
//             </button>
//           </div>
//         </div>
        
//         <div className="divide-y divide-gray-200">
//           {roles.map((role) => (
//             <div key={role.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex-shrink-0">
//                     <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
//                       <span className="text-white font-semibold text-sm">
//                         {role.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-base font-medium text-gray-900">
//                       {role.name}
//                     </h3>
//                     {role.description && (
//                       <p className="text-sm text-gray-500 mt-1">
//                         {role.description}
//                       </p>
//                     )}
//                     <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
//                       <span className="inline-flex items-center">
//                         <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                         </svg>
//                         {role.permissions?.length || 0} permissions
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                     Edit
//                   </button>
//                   <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleList