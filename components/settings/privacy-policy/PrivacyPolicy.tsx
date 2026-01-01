"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

import {
  ActGetPrivacyPolicy,
  ActUpdatePrivacyPolicy,
} from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";

import { CkEditor } from "../../ckEditor/CKEditorClient";
import PrivacyPolicyPageSkeleton from "./PrivacyPolicySkeleton";

export default function PrivacyPolicy() {
  const dispatch = useAppDispatch();
  const { privacyPolicy, loading } = useAppSelector(
    (state) => state.settings
  );

  const [form, setForm] = useState({ ar: "", en: "" });

  useEffect(() => {
    dispatch(ActGetPrivacyPolicy());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && privacyPolicy) {
      setForm({
        ar: privacyPolicy.ar ?? "",
        en: privacyPolicy.en ?? "",
      });
    }
  }, [loading, privacyPolicy]);

  const isReady = !loading && !!privacyPolicy;

  const arEditorConfig = useMemo(
    () => ({ language: "ar", direction: "rtl" as const }),
    []
  );

  const enEditorConfig = useMemo(
    () => ({ language: "en", direction: "ltr" as const }),
    []
  );

  const handleSubmit = async () => {
    try {
            await dispatch(ActUpdatePrivacyPolicy(form)).unwrap();
            toast.success("Privacy Policy updated successfully");
          } catch (err: any) {
            const errors = err?.errors as
              | Record<string, string[] | string>
              | undefined;
      
            if (errors) {
              Object.values(errors).forEach((value) => {
                if (Array.isArray(value)) {
                  value.forEach((msg) => toast.error(msg));
                } else {
                  toast.error(value);
                }
              });
            }
          }
  };

  /* ================= HARD RENDER GATE ================= */
  if (!isReady) {
    return <PrivacyPolicyPageSkeleton />;
  }

  /* ================= FULL PAGE ================= */
  return (
    <div className="p-6 mx-4 my-10 space-y-6 bg-white rounded-2xl border border-solid border-[#ddd]">
      <h3 className=" font-bold mainColor">
        Privacy Policy
      </h3>
      <p>arabic content</p>
      <CkEditor
        editorData={form.ar}
        handleOnUpdate={(value) =>
          setForm((prev) => ({ ...prev, ar: value }))
        }
        config={arEditorConfig}
      />
      <p>english content</p>
      <CkEditor
        editorData={form.en}
        handleOnUpdate={(value) =>
          setForm((prev) => ({ ...prev, en: value }))
        }
        config={enEditorConfig}
      />

      <button
        onClick={handleSubmit}
        className="bkMainColor text-white px-6 py-2 rounded-lg"
      >
        Save
      </button>
    </div>
  );
}









// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import {ActGetPrivacyPolicy,ActUpdatePrivacyPolicy,
// } from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";
// import { CkEditor } from "../../ckEditor/CKEditorClient";
// import { Skeleton } from "@/components/ui/skeleton";

// /* ================= CKEditor Skeleton ================= */
// const CkEditorSkeleton = () => {
//   return (
//     <div className="space-y-3">
//       {/* Toolbar */}
//       <Skeleton className="h-10 w-full rounded-md" />

//       {/* Editor Body */}
//       <Skeleton className="h-65 w-full rounded-md" />
//     </div>
//   );
// };

// const PrivacyPolicy = () => {
//   const dispatch = useAppDispatch();

//   const { privacyPolicy, loading } = useAppSelector(
//     (state) => state.settings
//   );

//   const [form, setForm] = useState({
//     ar: "",
//     en: "",
//   });

//   /* ================= fetch ================= */
//   useEffect(() => {
//     dispatch(ActGetPrivacyPolicy());
//   }, [dispatch]);

//   /* ============ sync store → local state ============ */
//   useEffect(() => {
//     if (privacyPolicy) {
//       setForm({
//         ar: privacyPolicy.ar || "",
//         en: privacyPolicy.en || "",
//       });
//     }
//   }, [privacyPolicy]);

//   /* ================= editor configs (STABLE) ================= */
//   const arEditorConfig = useMemo(
//     () => ({
//       language: "ar",
//       direction: "rtl" as const,
//       placeholder: "",
//     }),
//     []
//   );

//   const enEditorConfig = useMemo(
//     () => ({
//       language: "en",
//       direction: "ltr" as const,
//       placeholder: "",
//     }),
//     []
//   );

//   /* ================= data ready ================= */
//   const isDataReady = !loading && !!privacyPolicy;

//   /* ================= submit ================= */
//   const handleSubmit = async () => {
//     try {
//       await dispatch(ActUpdatePrivacyPolicy(form)).unwrap();
//       toast.success("Privacy Policy updated successfully");
//     } catch (err: any) {
//       const errors = err?.errors as
//         | Record<string, string[] | string>
//         | undefined;

//       if (errors) {
//         Object.values(errors).forEach((value) => {
//           if (Array.isArray(value)) {
//             value.forEach((msg) => toast.error(msg));
//           } else {
//             toast.error(value);
//           }
//         });
//       }
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 w-full space-y-6">
//       <h1 className="text-2xl font-bold mainColor">
//         Privacy Policy
//       </h1>

//       {/* Arabic */}
//       <div>
//         <label className="block mb-2 font-semibold text-sm">
//           Privacy Policy (Arabic)
//         </label>

//         {!isDataReady ? (
//           <CkEditorSkeleton />
//         ) : (
//           <CkEditor
//             editorData={form.ar}
//             handleOnUpdate={(value: string) =>
//               setForm((prev) => ({ ...prev, ar: value }))
//             }
//             config={arEditorConfig}
//           />
//         )}
//       </div>

//       {/* English */}
//       <div>
//         <label className="block mb-2 font-semibold text-sm">
//           Privacy Policy (English)
//         </label>

//         {!isDataReady ? (
//           <CkEditorSkeleton />
//         ) : (
//           <CkEditor
//             editorData={form.en}
//             handleOnUpdate={(value: string) =>
//               setForm((prev) => ({ ...prev, en: value }))
//             }
//             config={enEditorConfig}
//           />
//         )}
//       </div>

//       {/* Submit */}
//       <button
//         onClick={handleSubmit}
//         disabled={loading || !isDataReady}
//         className="bkMainColor text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-2"
//       >
//         {loading && <Loader2 className="w-4 h-4 animate-spin" />}
//         Save
//       </button>
//     </div>
//   );
// };

// export default PrivacyPolicy;













// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import {
//   ActGetPrivacyPolicy,
//   ActUpdatePrivacyPolicy,
// } from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";
// import {CkEditor} from "../../ckEditor/CKEditorClient";


// const PrivacyPolicy = () => {
//   const dispatch = useAppDispatch();

//   const { privacyPolicy, loading } = useAppSelector(
//     (state) => state.settings
//   );

//   const [form, setForm] = useState({
//     ar: "",
//     en: "",
//   });

//   /* ================= fetch ================= */
//   useEffect(() => {
//     dispatch(ActGetPrivacyPolicy());
//   }, [dispatch]);
//   /* ============ sync store → form ============ */
//   useEffect(() => {
//     if (privacyPolicy) {
//       setForm({
//         ar: privacyPolicy.ar || "",
//         en: privacyPolicy.en || "",
//       });
//     }
//   }, [privacyPolicy]);

//   /* ================= editor config (STABLE) ================= */
//   const arEditorConfig = useMemo(
//     () => ({
//       language: "ar",
//       direction: "rtl" as const,
//       placeholder: "",
//     }),
//     []
//   );
//     const enEditorConfig = useMemo(
//     () => ({
//       language: "en",
//       direction: "ltr" as const,
//       placeholder: "",
//     }),
//     []
//   );

//   /* ============== submit ================= */
//   const handleSubmit = async () => {
//     try {
//       await dispatch(ActUpdatePrivacyPolicy(form)).unwrap();
//       toast.success("Privacy Policy updated successfully");
//     } catch (err: any) {
//       const errors = err?.errors as
//         | Record<string, string[] | string>
//         | undefined;

//       if (errors) {
//         Object.values(errors).forEach((value) => {
//           if (Array.isArray(value)) {
//             value.forEach((msg) => toast.error(msg));
//           } else {
//             toast.error(value);
//           }
//         });
//       }
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 w-full space-y-6">
//       <h1 className="text-2xl font-bold mainColor">
//         Privacy Policy
//       </h1>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <Loader2 className="w-6 h-6 animate-spin" />
//         </div>
//       ) : (
//         <>
//           {/* Arabic */}
//           <div>
//             <label className="block mb-2 font-semibold text-sm">
//               Privacy Policy (Arabic)
//             </label>

//             <CkEditor
//               editorData={form.ar}
//               handleOnUpdate={(value: string) =>
//                 setForm((prev) => ({ ...prev, ar: value }))
//               }
//               config={arEditorConfig}
//             />
//           </div>

//           {/* English */}
//           <div>
//             <label className="block mb-2 font-semibold text-sm">
//               Privacy Policy (English)
//             </label>
//               <CkEditor
//                 editorData={form.en}
//                 handleOnUpdate={(value: string) =>
//                   setForm((prev) => ({ ...prev, en: value }))
//                 }
//               config={enEditorConfig}
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bkMainColor text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
//           >
//             {loading ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               "Save"
//             )}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PrivacyPolicy;