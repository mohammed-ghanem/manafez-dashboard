// "use client";

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { ActFetchPermissions } from "@/store/permissions/thunkActions";
// import { ActCreateRole } from "@/store/roles/thunkActions/ActCreateRole";

// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";

// const RoleSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   name_ar: z.string().min(1, "Arabic name is required"),
//   name_en: z.string().min(1, "English name is required"),
//   permissions: z.array(z.number()).min(1, "At least one permission is required"),
// });

// export default function CreateRolePage() {
//   const dispatch = useAppDispatch();
//   const { permissions } = useAppSelector((s) => s.permissions);
//   const { operationStatus } = useAppSelector((s) => s.roles);

//   useEffect(() => {
//     dispatch(ActFetchPermissions());
//   }, [dispatch]);

//   const form = useForm({
//     resolver: zodResolver(RoleSchema),
//     defaultValues: {
//       name: "",
//       name_ar: "",
//       name_en: "",
//       permissions: [],
//     },
//   });

//   const onSubmit = (values: z.infer<typeof RoleSchema>) => {
//     console.log("Submitting form:", values);
    
//     // Send the data exactly as the backend expects
//     dispatch(ActCreateRole({
//       name: values.name,
//       name_ar: values.name_ar,
//       name_en: values.name_en,
//       permissions: values.permissions,
//     }));
//   };

//   // Group permissions by category name (like Postman)
//   const groupedPermissions = permissions?.reduce((acc, perm) => {
//     const categoryName = perm.name; // This should be the main category like "مديرين النظام"
    
//     if (!acc[categoryName]) {
//       acc[categoryName] = {
//         name: categoryName,
//         controls: [],
//         allControl: null
//       };
//     }
    
//     // Find the "الكل" (all) control for this category
//     const allControl = perm.controls?.find(control => control.key === "الكل");
//     if (allControl) {
//       acc[categoryName].allControl = allControl;
//     }
    
//     // Add all controls to the category
//     if (perm.controls) {
//       acc[categoryName].controls.push(...perm.controls);
//     }
    
//     return acc;
//   }, {} as Record<string, { name: string; controls: any[]; allControl: any | null }>);

//   const groupedPermissionsArray = groupedPermissions ? Object.values(groupedPermissions) : [];

//   // Handle select all for a category
//   const handleSelectAll = (category: typeof groupedPermissionsArray[0], field: any) => {
//     const currentValues = Array.isArray(field.value) ? field.value : [];
//     const allControlIds = category.controls.map(control => control.id);

//     // Check if all controls in this category are already selected
//     const allSelected = allControlIds.every(id => currentValues.includes(id));

//     let updatedValues: number[];

//     if (allSelected) {
//       // Remove all controls from this category
//       updatedValues = currentValues.filter(id => !allControlIds.includes(id));
//     } else {
//       // Add all controls from this category
//       updatedValues = [...new Set([...currentValues, ...allControlIds])];
//     }

//     field.onChange(updatedValues);
//   };

//   // Handle individual checkbox change
//   const handleCheckboxChange = (controlId: number, checked: boolean, field: any) => {
//     const currentValues = Array.isArray(field.value) ? field.value : [];
    
//     const updatedValues = checked
//       ? [...currentValues, controlId]
//       : currentValues.filter((v) => v !== controlId);

//     field.onChange(updatedValues);
//   };

//   // Check if all controls in a category are selected
//   const isCategoryAllSelected = (category: typeof groupedPermissionsArray[0], fieldValue: number[]) => {
//     const allControlIds = category.controls.map(control => control.id);
//     return allControlIds.length > 0 && allControlIds.every(id => fieldValue.includes(id));
//   };

//   // Check if some controls in a category are selected
//   const isCategorySomeSelected = (category: typeof groupedPermissionsArray[0], fieldValue: number[]) => {
//     const allControlIds = category.controls.map(control => control.id);
//     return allControlIds.some(id => fieldValue.includes(id)) && 
//            !allControlIds.every(id => fieldValue.includes(id));
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           {/* Name Field */}
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name (Primary)</FormLabel>
//                 <FormControl>
//                   <Input 
//                     placeholder="Enter role name..." 
//                     {...field} 
//                     className="w-full"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Arabic Name Field */}
//           <FormField
//             control={form.control}
//             name="name_ar"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name (Arabic)</FormLabel>
//                 <FormControl>
//                   <Input 
//                     placeholder="صلاحية..." 
//                     {...field} 
//                     className="w-full"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* English Name Field */}
//           <FormField
//             control={form.control}
//             name="name_en"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name (English)</FormLabel>
//                 <FormControl>
//                   <Input 
//                     placeholder="Role..." 
//                     {...field} 
//                     className="w-full"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="permissions"
//             render={({ field }) => {
//               const selected = Array.isArray(field.value) ? field.value : [];

//               return (
//                 <FormItem>
//                   <FormLabel>Permissions</FormLabel>
                  
//                   <div className="space-y-4 mt-3">
//                     {groupedPermissionsArray.map((category) => {
//                       const allSelected = isCategoryAllSelected(category, selected);
//                       const someSelected = isCategorySomeSelected(category, selected);

//                       return (
//                         <div key={category.name} className="border rounded-lg p-4">
//                           {/* Category Header with Select All */}
//                           <div className="flex items-center gap-2 mb-3 pb-2 border-b">
//                             <Checkbox
//                               checked={allSelected}
//                               onCheckedChange={() => handleSelectAll(category, field)}
//                             />
//                             <span className="font-semibold text-lg">{category.name}</span>
//                           </div>

//                           {/* Individual Controls */}
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4">
//                             {category.controls.map((control) => (
//                               <div key={control.id} className="flex items-center gap-2">
//                                 <Checkbox
//                                   checked={selected.includes(control.id)}
//                                   onCheckedChange={(checked) => 
//                                     handleCheckboxChange(control.id, checked as boolean, field)
//                                   }
//                                 />
//                                 <span>{control.name}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <FormMessage />
//                 </FormItem>
//               );
//             }}
//           />

//           <Button 
//             type="submit" 
//             disabled={operationStatus === "loading"} 
//             className="w-full"
//           >
//             {operationStatus === "loading" ? "Creating..." : "Create Role"}
//           </Button>

//           {/* Debug info - remove in production */}
//           <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
//             <p>Form Values:</p>
//             <ul>
//               <li>Name: {form.watch("name") || "Empty"}</li>
//               <li>Name (AR): {form.watch("name_ar") || "Empty"}</li>
//               <li>Name (EN): {form.watch("name_en") || "Empty"}</li>
//               <li>Selected Permissions: {form.watch("permissions")?.join(", ") || "None"}</li>
//             </ul>
//             <p>Form Valid: {form.formState.isValid ? "Yes" : "No"}</p>
//             <p>Form Errors: {JSON.stringify(form.formState.errors)}</p>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }