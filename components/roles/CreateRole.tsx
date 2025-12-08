/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchPermissions } from "@/store/permissions/thunkActions";
import { ActCreateRole } from "@/store/roles/thunkActions";

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
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, record, error } = useAppSelector(
    (state) => state.permissions
  );

  // Form fields
  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");

  // Permissions selection
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    dispatch(ActFetchPermissions());
  }, [dispatch]);

  // Toggle single control
  const toggleControl = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const all = record.flatMap((g: any) => g.controls.map((c: any) => c.id));
    setSelected(all);
    toast.success("All permissions selected");
  };

  // Select all inside a group
  const selectGroup = (controls: any[]) => {
    const ids = controls.map((c) => c.id);

    setSelected((prev) => {
      const notIncluded = ids.filter((id) => !prev.includes(id));
      return [...prev, ...notIncluded];
    });

    toast.success("Group permissions selected");
  };

  // Create Role Submit
  const handleCreateRole = async () => {
    if (!name || !name_en || !name_ar) {
      toast.error("Please fill all name fields");
      return;
    }

    if (selected.length === 0) {
      toast.error("Select at least 1 permission");
      return;
    }

    try {
      await dispatch(
        ActCreateRole({
          name,
          name_en,
          name_ar,
          permissions: selected,
        })
      ).unwrap();

      toast.success("Role created successfully");
      router.push("/roles");
    } catch (err: any) {
      if (err?.errors) {
        Object.values(err.errors).forEach((e: any) => toast.error(e));
      } else {
        toast.error(err?.message || "Create failed");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-semibold">Create Role</h1>
      </div>

      <Separator />

      {/* Role Info */}
      <Card className="p-6 shadow-md border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Role Details</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-3 gap-4">

          <div className="flex flex-col space-y-2">
            <Label>Name (Default)</Label>
            <Input
              placeholder="Role name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Name (English)</Label>
            <Input
              placeholder="Role name in English"
              value={name_en}
              onChange={(e) => setNameEn(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Name (Arabic)</Label>
            <Input
              placeholder="Role name in Arabic"
              value={name_ar}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </div>

        </CardContent>
      </Card>

      {/* Permissions Header */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <Badge variant="outline">
            {selected.length} selected
          </Badge>
        </div>

        <Button
          variant="outline"
          onClick={selectAllPermissions}
          className="flex gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          Select All
        </Button>
      </div>

      {loading && <p>Loading permissions...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Permissions */}
      {record && record.length > 0 && (
        <ScrollArea className="h-[65vh] pr-4">
          <div className="grid grid-cols-3 gap-5">
            {record.map((group: any, idx: number) => (
              <Card
                key={idx}
                className="border shadow-sm hover:shadow-md transition-all"
              >
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
                    onClick={() => selectGroup(group.controls)}
                  >
                    Select Group
                  </Button>
                </CardHeader>

                <CardContent className="space-y-2 mt-2">
                  {group.controls?.map((control: any) => (
                    <div
                      key={control.id}
                      className={`flex items-center gap-3 border rounded-lg p-3 transition-all
                        ${
                          selected.includes(control.id)
                            ? "bg-primary/10 border-primary"
                            : "bg-white"
                        }
                      `}
                    >
                      <Checkbox
                        checked={selected.includes(control.id)}
                        onCheckedChange={() => toggleControl(control.id)}
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
      <Button className="w-full py-5 text-lg" onClick={handleCreateRole}>
        <CircleCheckBig className="w-5 h-5 mr-2" />
        Create Role
      </Button>
    </div>
  );
};

export default CreateRole;




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// // Redux
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchPermissions } from "@/store/permissions/thunkActions";
// import { ActCreateRole } from "@/store/roles/thunkActions";

// // UI
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";

// // Icons
// import { Shield, CheckSquare } from "lucide-react";

// // Toast
// import { toast } from "sonner";

// const CreateRole = () => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const { loading, record, error } = useAppSelector(
//     (state) => state.permissions
//   );

//   // Form fields
//   const [name, setName] = useState("");
//   const [name_en, setNameEn] = useState("");
//   const [name_ar, setNameAr] = useState("");

//   // Permissions selection
//   const [selected, setSelected] = useState<number[]>([]);

//   useEffect(() => {
//     dispatch(ActFetchPermissions());
//   }, [dispatch]);

//   // Toggle single control
//   const toggleControl = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   // Select all permissions globally
//   const selectAllPermissions = () => {
//     const all = record.flatMap((g: any) => g.controls.map((c: any) => c.id));
//     setSelected(all);
//   };

//   // Select all in a specific group
//   const selectGroup = (controls: any[]) => {
//     const ids = controls.map((c) => c.id);

//     setSelected((prev) => {
//       const notIncluded = ids.filter((id) => !prev.includes(id));
//       return [...prev, ...notIncluded];
//     });
//   };

//   // Create Role Submit
//   const handleCreateRole = async () => {
//     if (!name || !name_en || !name_ar) {
//       toast.error("All names are required");
//       return;
//     }
  
//     if (selected.length === 0) {
//       toast.error("Select at least one permission");
//       return;
//     }
  
//     try {
//       await dispatch(
//         ActCreateRole({
//           name,
//           name_en,
//           name_ar,
//           permissions: selected,
//         })
//       ).unwrap();
  
//       toast.success("Role created successfully");
//       router.push("/roles");
  
//     } catch (err: any) {
//       if (err?.errors) {
//         Object.values(err.errors).forEach((e: any) => toast.error(e));
//       } else {
//         toast.error(err?.message || "Create failed");
//       }
//     }
//   };
  

//   return (
//     <div className="p-6 space-y-6">
//       {/* Title */}
//       <h1 className="text-2xl font-semibold flex items-center gap-2">
//         <Shield className="w-6 h-6 text-primary" />
//         Create Role
//       </h1>

//       {/* Role Inputs */}
//       <Card className="p-4 space-y-4">
//         <div>
//           <Label>Role Name (Default)</Label>
//           <Input
//             className="mt-1"
//             placeholder="Role name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Role Name (English)</Label>
//           <Input
//             className="mt-1"
//             placeholder="Role name in English"
//             value={name_en}
//             onChange={(e) => setNameEn(e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Role Name (Arabic)</Label>
//           <Input
//             className="mt-1"
//             placeholder="Role name in Arabic"
//             value={name_ar}
//             onChange={(e) => setNameAr(e.target.value)}
//           />
//         </div>
//       </Card>

//       {/* Permissions */}
//       <div className="flex justify-between items-center mt-4">
//         <h2 className="text-lg font-semibold">Permissions</h2>

//         <Button
//           variant="outline"
//           onClick={selectAllPermissions}
//           className="flex gap-2"
//         >
//           <CheckSquare className="w-4 h-4" />
//           Select All Permissions
//         </Button>
//       </div>

//       {loading && <p>Loading permissions...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {record && record.length > 0 && (
//         <ScrollArea className="h-[60vh] pr-4">
//           <div className="space-y-6 grid grid-cols-3">
//             {record.map((group: any) => (
//               <Card key={group.name} className="border rounded-xl shadow-sm">
//                 <CardHeader className="flex justify-between items-center">
//                   <CardTitle className="capitalize text-lg">
//                     {group.name}
//                   </CardTitle>

//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     onClick={() => selectGroup(group.controls)}
//                   >
//                     Select Group
//                   </Button>
//                 </CardHeader>

//                 <CardContent>
//                   <div className="space-y-3">
//                     {group.controls?.map((control: any) => (
//                       <div
//                         key={control.id}
//                         className="flex items-center gap-3 border rounded-lg p-3 bg-white"
//                       >
//                         <Checkbox
//                           checked={selected.includes(control.id)}
//                           onCheckedChange={() => toggleControl(control.id)}
//                         />

//                         <span className="text-sm font-medium">
//                           {control.name}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </ScrollArea>
//       )}

//       {/* Submit Button */}
//       <Button className="w-full mt-6" onClick={handleCreateRole}>
//         Create Role
//       </Button>
//     </div>
//   );
// };

// export default CreateRole;




