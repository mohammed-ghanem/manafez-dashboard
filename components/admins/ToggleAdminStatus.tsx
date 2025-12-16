// const onToggle = async (a: IAdmin) => {
//     const normalized = (a.name ?? "").trim().toLowerCase();
//     if (protectedNames.includes(normalized)) return;
  
//     try {
//       await dispatch(
//         ActToggleAdminStatus({
//           id: a.id,
//           is_active: !a.is_active,
//         })
//       ).unwrap();
  
//       toast.success(
//         a.is_active ? "تم تعطيل المسؤول" : "تم تفعيل المسؤول"
//       );
//     } catch (err: any) {
//       toast.error("فشل تحديث الحالة");
//     }
//   };
  