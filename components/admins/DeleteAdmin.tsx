// import { toast } from "sonner";

// const onDelete = async (id: number, name?: string) => {
//   const normalized = (name ?? "").trim().toLowerCase();
//   if (protectedNames.includes(normalized)) return;

//   if (!confirm("هل أنت متأكد من حذف المسؤول؟")) return;

//   try {
//     await dispatch(ActDeleteAdmin(id)).unwrap();
//     toast.success("تم حذف المسؤول بنجاح");
//     dispatch(ActFetchAdmins()); // keep list in sync
//   } catch (err: any) {
//     toast.error(err || "فشل حذف المسؤول");
//   }
// };
