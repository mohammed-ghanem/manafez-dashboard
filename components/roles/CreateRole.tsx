"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchPermissions } from "@/store/permissions/thunkActions";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

const CreateRole = () => {
  const dispatch = useAppDispatch();

  const { loading, record, error } = useAppSelector(
    (state) => state.permissions
  );

  // Selected permissions state
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    dispatch(ActFetchPermissions());
  }, [dispatch]);

  const toggleControl = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        Create Role
      </h1>

      {loading && <p>Loading permissions...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {record && record.length > 0 && (
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 grid grid-cols-3">
            {record.map((group: any) => (
              <Card key={group.name} 
                    className="border rounded-xl shadow-sm ml-4">
                <CardHeader>
                  <CardTitle className="capitalize text-lg">
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.controls?.map((control: any) => (
                      <div
                        key={control.id}
                        className="flex items-center gap-3 border rounded-lg p-3 bg-white"
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CreateRole;









// "use client";

// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchPermissions } from "@/store/permissions/thunkActions";

// const CreateRole = () => {
//   const dispatch = useAppDispatch();

//   const { loading, record, error } = useAppSelector(
//     (state) => state.permissions
//   );

//   useEffect(() => {
//     dispatch(ActFetchPermissions());
//   }, [dispatch]);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-semibold mb-4">Create Role</h1>

//       {loading && <p>Loading permissions...</p>}
//       {error && <p className="text-red-600">{error}</p>}

//       {record && record.length > 0 && (
//         <div className="space-y-6 mt-4">
//           {record.map((group: any) => (
//             <div key={group.name} className="border rounded-lg p-4 bg-gray-50">
//               <h2 className="text-lg font-semibold mb-2 capitalize">
//                 {group.name}
//               </h2>

//               <ul className="space-y-1">
//                 {group.controls?.map((control: any) => (
//                   <li
//                     key={control.id}
//                     className="p-2 border rounded-md bg-white"
//                   >
//                     {control.name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateRole;
