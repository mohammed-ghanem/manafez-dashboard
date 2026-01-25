/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Hooks
import { useSessionReady } from "@/hooks/useSessionReady";

// RTK
import { useGetPermissionsQuery } from "@/store/permissions/permissionsApi";
import { useCreateRoleMutation } from "@/store/roles/rolesApi";

// UI
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Shield,
  CheckSquare,
  FolderCheck,
  CircleCheckBig,
} from "lucide-react";

// Toast
import { toast } from "sonner";

const CreateRole = () => {
  const router = useRouter();
  const sessionReady = useSessionReady();

  /* ===================== API ===================== */
  const {
    data: permissions,
    isLoading,
    isError,
  } = useGetPermissionsQuery(undefined, {
    skip: !sessionReady,
  });

  const [createRole, { isLoading: isCreating }] =
    useCreateRoleMutation();

  /* ===================== FORM STATE ===================== */
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

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
  const handleCreateRole = async () => {
    try {
      const res = await createRole({
        name_en,
        name_ar,
        permissions: selected,
      }).unwrap();

      toast.success(res?.message || "Role created successfully");
      router.push("/roles");
    } catch (err: any) {
      if (err?.errors) {
        Object.values(err.errors).forEach((e: any) => {
          Array.isArray(e)
            ? e.forEach((m) => toast.error(m))
            : toast.error(e);
        });
        return;
      }
      toast.error(err?.message || "Create role failed");
    }
  };

  /* ===================== GUARDS ===================== */
  if (!sessionReady) return null;

  /* ===================== UI ===================== */
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-semibold">Create Role</h1>
      </div>

      <Separator />

      {/* Role Info */}
      <Card className="p-6 shadow border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Role Details
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <Label>Name (English)</Label>
            <Input
              value={name_en}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Role name in English"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Name (Arabic)</Label>
            <Input
              value={name_ar}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="Role name in Arabic"
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissions Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <Badge variant="outline">
            {selected.length} selected
          </Badge>
        </div>

        <Button
          variant="outline"
          onClick={selectAllPermissions}
          disabled={isLoading || !permissions}
          className="flex gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          Select All
        </Button>
      </div>

      {/* Permissions Content */}
      {isLoading && (
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-destructive">
          Failed to load permissions
        </p>
      )}

      {permissions && (
        <ScrollArea className="h-[65vh] pr-4">
          <div className="grid grid-cols-3 gap-5">
            {permissions.map((group: any, idx: number) => (
              <Card key={idx} className="border shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FolderCheck className="h-5 w-5 text-primary" />
                    <CardTitle className="capitalize text-base">
                      {group.name}
                    </CardTitle>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      selectGroup(group.controls)
                    }
                  >
                    Select Group
                  </Button>
                </CardHeader>

                <CardContent className="space-y-2">
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
      )}

      {/* Submit */}
      <Button
        className="w-full py-5 text-lg"
        onClick={handleCreateRole}
        disabled={
          isCreating ||
          !name_en ||
          !name_ar ||
          selected.length === 0
        }
      >
        <CircleCheckBig className="w-5 h-5 mr-2" />
        {isCreating ? "Creating..." : "Create Role"}
      </Button>
    </div>
  );
};

export default CreateRole;




























// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { useGetPermissionsQuery } from "@/store/permissions/permissionsApi";
// import { useCreateRoleMutation } from "@/store/roles/rolesApi";
 

// // UI
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";

// // Icons
// import {
//   Shield,
//   CheckSquare,
//   FolderCheck,
//   CircleCheckBig,
// } from "lucide-react";

// // Toast
// import { toast } from "sonner";

// const CreateRole = () => {
//   const router = useRouter();

//   const { data: permissions, isLoading, error }
//     = useGetPermissionsQuery() as { data: any[] | undefined; isLoading: boolean; error: any };
//   const [createRole] = useCreateRoleMutation();


//   // Form fields
//   const [name_en, setNameEn] = useState("");
//   const [name_ar, setNameAr] = useState("");

//   // Permissions selection
//   const [selected, setSelected] = useState<number[]>([]);


//   // Toggle single control
//   const toggleControl = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   // Select all permissions
//   const selectAllPermissions = () => {
//     if (!permissions) return;

//     const allIds = permissions.flatMap((g) =>
//       g.controls.map((c: any) => c.id)
//     );

//     setSelected((prev) =>
//       allIds.every((id) => prev.includes(id)) ? [] : allIds
//     );
//   };

//   // Select all inside a group
//   const selectGroup = (controls: any[]) => {
//     const ids = controls.map((c) => c.id);

//     setSelected((prev) => {
//       const isGroupSelected = ids.every((id) => prev.includes(id));

//       if (isGroupSelected) {
//         // remove group permissions
//         return prev.filter((id) => !ids.includes(id));
//       }

//       // add missing group permissions
//       return [...prev, ...ids.filter((id) => !prev.includes(id))];
//     });

//     toast.success("Group permissions toggled");
//   };


//   // Create Role Submit
//   const handleCreateRole = async () => {
//     try {
//       const res = await createRole({
//         name_en,
//         name_ar,
//         permissions: selected,
//       }).unwrap();

//       toast.success(res?.message || "Role created successfully");
//       router.push("/roles");
//     } catch (err: any) {
//       if (err?.errors) {
//         Object.values(err.errors).forEach((e: any) => {
//           if (Array.isArray(e)) e.forEach((m) => toast.error(m));
//           else toast.error(e);
//         });
//         return;
//       }

//       toast.error(err?.message || "Create role failed");
//     }
//   };


//   return (
//     <div className="p-6 space-y-6">

//       {/* Header */}
//       <div className="flex items-center gap-2">
//         <Shield className="w-7 h-7 text-primary" />
//         <h1 className="text-3xl font-semibold">Create Role</h1>
//       </div>

//       <Separator />

//       {/* Role Info */}
//       <Card className="p-6 shadow-md border border-gray-200">
//         <CardHeader className="pb-2">
//           <CardTitle className="text-lg font-medium">Role Details</CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-3 gap-4">



//           <div className="flex flex-col space-y-2">
//             <Label>Name (English)</Label>
//             <Input
//               placeholder="Role name in English"
//               value={name_en}
//               onChange={(e) => setNameEn(e.target.value)}
//             />
//           </div>

//           <div className="flex flex-col space-y-2">
//             <Label>Name (Arabic)</Label>
//             <Input
//               placeholder="Role name in Arabic"
//               value={name_ar}
//               onChange={(e) => setNameAr(e.target.value)}
//             />
//           </div>

//         </CardContent>
//       </Card>


//       {/* Permissions */}
//       <div className="flex justify-between items-center mt-4">
//         <div className="flex items-center gap-3">
//           <h2 className="text-xl font-semibold">Permissions</h2>
//           <Badge variant="outline">
//             {selected.length} selected
//           </Badge>
//         </div>

//         <Button
//           variant="outline"
//           onClick={selectAllPermissions}
//           className="flex gap-2"
//         >
//           <CheckSquare className="w-4 h-4" />
//           Select All
//         </Button>
//       </div>

//       {isLoading && <p>Loading permissions...</p>}
//       {error && <p className="text-destructive">Error loading permissions.</p>}
//       {/* Permissions */}
//       {permissions && (
//         <ScrollArea className="h-[65vh] pr-4">
//           <div className="grid grid-cols-3 gap-5">
//             {permissions.map((group: any, idx: number) => (
//               <Card
//                 key={idx}
//                 className="border shadow-sm hover:shadow-md transition-all"
//               >
//                 <CardHeader className="flex flex-row justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <FolderCheck className="h-5 w-5 text-primary" />
//                     <CardTitle className="capitalize text-base">
//                       {group.name}
//                     </CardTitle>
//                   </div>

//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     onClick={() => selectGroup(group.controls)}
//                   >
//                     Select Group
//                   </Button>
//                 </CardHeader>

//                 <CardContent className="space-y-2 mt-2">
//                   {group.controls?.map((control: any) => (
//                     <div
//                       key={control.id}
//                       className={`flex items-center gap-3 border rounded-lg p-3 transition-all
//                         ${selected.includes(control.id)
//                           ? "bg-primary/10 border-primary"
//                           : "bg-white"
//                         }
//                       `}
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
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </ScrollArea>
//       )}

//       {/* Submit */}
//       <Button className="w-full py-5 text-lg" onClick={handleCreateRole}>
//         <CircleCheckBig className="w-5 h-5 mr-2" />
//         Create Role
//       </Button>
//     </div>
//   );
// };

// export default CreateRole;