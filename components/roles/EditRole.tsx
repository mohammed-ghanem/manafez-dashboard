/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Hooks
import { useSessionReady } from "@/hooks/useSessionReady";

// RTK
import { useGetPermissionsQuery } from "@/store/permissions/permissionsApi";
import {
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/store/roles/rolesApi";

// UI
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { Shield, CheckSquare } from "lucide-react";

// Toast
import { toast } from "sonner";

const EditRole = () => {
  const router = useRouter();
  const params = useParams();
  const sessionReady = useSessionReady();

  const roleId =
    typeof params.id === "string" ? Number(params.id) : undefined;

  /* ===================== API ===================== */
  const {
    data: permissions,
    isLoading: permLoading,
    isError: permError,
  } = useGetPermissionsQuery(undefined, {
    skip: !sessionReady,
  });

  const {
    data: roleData,
    isLoading: roleLoading,
    isError: roleError,
  } = useGetRoleByIdQuery(roleId!, {
    skip: !sessionReady || !roleId,
  });

  const [updateRole, { isLoading: isUpdating }] =
    useUpdateRoleMutation();

  /* ===================== FORM STATE ===================== */
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  /* ===================== FILL DATA ===================== */
  useEffect(() => {
    if (!roleData) return;

    setNameEn(roleData.name_en || "");
    setNameAr(roleData.name_ar || "");

    if (roleData.permissions) {
      const ids = roleData.permissions.flatMap((g: any) =>
        g.controls.map((c: any) => c.id)
      );
      setSelected(ids);
    }
  }, [roleData]);

  /* ===================== HELPERS ===================== */
  const toggleControl = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAllPermissions = () => {
    if (!permissions) return;

    const allIds = permissions.flatMap((g) =>
      g.controls.map((c: any) => c.id)
    );

    setSelected((prev) =>
      allIds.every((id) => prev.includes(id)) ? [] : allIds
    );
  };

  const selectGroup = (controls: any[]) => {
    const ids = controls.map((c) => c.id);

    setSelected((prev) => {
      const isSelected = ids.every((id) => prev.includes(id));
      if (isSelected) {
        return prev.filter((id) => !ids.includes(id));
      }
      return [...prev, ...ids.filter((id) => !prev.includes(id))];
    });
  };

  /* ===================== SUBMIT ===================== */
  const handleUpdate = async () => {
    if (!name_en || !name_ar) {
      toast.error("All name fields are required");
      return;
    }

    if (selected.length === 0) {
      toast.error("Select at least one permission");
      return;
    }

    if (!roleId) {
      toast.error("Invalid role id");
      return;
    }

    try {
      const res = await updateRole({
        id: roleId,
        body: {
          name_en,
          name_ar,
          permissions: selected,
        },
      }).unwrap();

      toast.success(res?.message || "Role updated successfully");
      router.push("/roles");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  };

  /* ===================== GUARDS ===================== */
  if (!sessionReady) return null;

  if (roleLoading || permLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (roleError || permError) {
    return (
      <p className="p-6 text-destructive">
        Failed to load role data
      </p>
    );
  }

  /* ===================== UI ===================== */
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        Edit Role
      </h1>

      {/* Role Info */}
      <Card className="p-4 space-y-4">
        <div>
          <Label>Role Name (English)</Label>
          <Input
            className="mt-1"
            value={name_en}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </div>

        <div>
          <Label>Role Name (Arabic)</Label>
          <Input
            className="mt-1"
            value={name_ar}
            onChange={(e) => setNameAr(e.target.value)}
          />
        </div>
      </Card>

      {/* Permissions Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Permissions</h2>

        <Button variant="outline" onClick={selectAllPermissions}>
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
      </div>

      {/* Permissions */}
      <ScrollArea className="h-[60vh] pr-3">
        <div className="grid grid-cols-3 gap-6">
          {permissions?.map((group: any) => (
            <Card key={group.name} className="border rounded-xl">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="capitalize">
                  {group.name}
                </CardTitle>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => selectGroup(group.controls)}
                >
                  Select Group
                </Button>
              </CardHeader>

              <CardContent className="space-y-3">
                {group.controls.map((control: any) => (
                  <div
                    key={control.id}
                    className={`flex items-center gap-3 border rounded-lg p-3
                      ${
                        selected.includes(control.id)
                          ? "bg-primary/10 border-primary"
                          : ""
                      }`}
                  >
                    <Checkbox
                      checked={selected.includes(control.id)}
                      onCheckedChange={() =>
                        toggleControl(control.id)
                      }
                    />
                    <span className="text-sm font-medium">
                      {control.name}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Submit */}
      <Button
        className="w-full"
        onClick={handleUpdate}
        disabled={isUpdating}
      >
        Update Role
      </Button>
    </div>
  );
};

export default EditRole;


















// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// import { useGetPermissionsQuery } from "@/store/permissions/permissionsApi";
// import {
//   useGetRoleByIdQuery,
//   useUpdateRoleMutation,
// } from "@/store/roles/rolesApi";


// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";

// import { Shield, CheckSquare } from "lucide-react";
// import { toast } from "sonner";

// const EditRole = () => {
//   const router = useRouter();
//   const params = useParams();

// const roleId =
//   typeof params.id === "string" ? Number(params.id) : undefined;

//   const { data: permissions, isLoading: permLoading } = useGetPermissionsQuery();
// const {
//   data: roleData,
//   isLoading: roleLoading,
// } = useGetRoleByIdQuery(roleId!, {
//   skip: !roleId,
// });

// console.log("ROLE DATA =>", roleData);

//   const [updateRole] = useUpdateRoleMutation();


//   // Form state
//   const [name_en, setNameEn] = useState("");
//   const [name_ar, setNameAr] = useState("");

//   // Permission IDs
//   const [selected, setSelected] = useState<number[]>([]);

//     console.log("ROLE DATA =>", roleData);

//   // Fill form after loading
//   useEffect(() => {
// if (!roleData || roleLoading) return;



//     setNameEn(roleData.name_en || "");
//     setNameAr(roleData.name_ar || "");

//     if (roleData.permissions) {
//       const ids = roleData.permissions.flatMap((g: any) =>
//         g.controls.map((c: any) => c.id)
//       );
//       setSelected(ids);
//     }
//   }, [roleData , roleLoading]);


//   // Toggle single control
//   const toggleControl = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id)
//         ? prev.filter((x) => x !== id)
//         : [...prev, id]
//     );
//   };

//   // Select all permissions
//   const selectAllPermissions = () => {
//     if (!permissions) return;

//     const allIds = permissions.flatMap((g) =>
//       g.controls.map((c: any) => c.id)
//     );
//     setSelected(allIds);
//   };

//   // Select whole group
// const selectGroup = (controls: any[]) => {
//   const ids = controls.map((c) => c.id);

//   setSelected((prev) => {
//     const isGroupSelected = ids.every((id) => prev.includes(id));

//     if (isGroupSelected) {
//       // remove group permissions
//       return prev.filter((id) => !ids.includes(id));
//     }

//     // add missing permissions only
//     return [...prev, ...ids.filter((id) => !prev.includes(id))];
//   });
// };


//   // Update role
// const handleUpdate = async () => {
//   if ( !name_en || !name_ar) { 
//     toast.error("All name fields are required");
//     return;
//   }

//   if (selected.length === 0) {
//     toast.error("Select at least one permission");
//     return;
//   }

//   if (!roleId) {
//     toast.error("Role ID is missing");
//     return;
//   }

//   try {
//     const res = await updateRole({
//       id: roleId,
//       body: {
//         name_en,
//         name_ar,
//         permissions: selected,
//       },
//     }).unwrap();

//     toast.success(res?.message || "Role updated successfully");
//     router.push("/roles");
//   } catch (err: any) {
//     toast.error(err?.message || "Update failed");
//   }
// };


//   if (roleLoading || permLoading) {
//     return <div className="p-6">Loading...</div>;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-semibold flex items-center gap-2">
//         <Shield className="w-6 h-6 text-primary" />
//         Edit Role
//       </h1>

//       {/* Form */}
//       <Card className="p-4 space-y-4">

//         <div>
//           <Label>Role Name (English)</Label>
//           <Input
//             className="mt-1"
//             value={name_en}
//             onChange={(e) => setNameEn(e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Role Name (Arabic)</Label>
//           <Input
//             className="mt-1"
//             value={name_ar}
//             onChange={(e) => setNameAr(e.target.value)}
//           />
//         </div>
//       </Card>

//       {/* Permissions */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-lg font-semibold">Permissions</h2>

//         <Button variant="outline" onClick={selectAllPermissions}>
//           <CheckSquare className="w-4 h-4 mr-2" />
//           Select All
//         </Button>
//       </div>

//       <ScrollArea className="h-[60vh] pr-3">
//         <div className="grid grid-cols-3 gap-6">
//           {permissions?.map((group: any) => (
//             <Card key={group.name} className="border rounded-xl shadow-sm">
//               <CardHeader className="flex justify-between items-center">
//                 <CardTitle className="capitalize">{group.name}</CardTitle>
//                 <Button
//                   size="sm"
//                   variant="secondary"
//                   onClick={() => selectGroup(group.controls)}
//                 >
//                   Select Group
//                 </Button>
//               </CardHeader>

//               <CardContent>
//                 <div className="space-y-3">
//                   {group.controls.map((control: any) => (
//                     <div
//                       key={control.id}
//                       className="flex items-center gap-3 border rounded-lg p-3"
//                     >
//                       <Checkbox
//                         checked={selected.includes(control.id)}
//                         onCheckedChange={() => toggleControl(control.id)}
//                       />

//                       <span className="text-sm font-medium">
//                         {control.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </ScrollArea>

//       <Button className="w-full" onClick={handleUpdate}>
//         Update Role
//       </Button>
//     </div>
//   );
// };

// export default EditRole;