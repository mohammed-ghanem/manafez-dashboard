/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ActGetPrivacyPolicy,
  ActUpdatePrivacyPolicy,
} from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";
import dynamic from "next/dynamic";

/* ✅ IMPORTANT: dynamic import OUTSIDE component */
const CkEditor = dynamic(() => import("../../ckEditor/CKEditor"), {
  ssr: false,
});

const PrivacyPolicy = () => {
  const dispatch = useAppDispatch();

  const { privacyPolicy, loading } = useAppSelector(
    (state) => state.settings
  );

  const [form, setForm] = useState({
    ar: "",
    en: "",
  });

  /* ================= fetch ================= */
  useEffect(() => {
    dispatch(ActGetPrivacyPolicy());
  }, [dispatch]);

  /* ============ sync store → form ============ */
  useEffect(() => {
    if (privacyPolicy) {
      setForm({
        ar: privacyPolicy.ar || "",
        en: privacyPolicy.en || "",
      });
    }
  }, [privacyPolicy]);

  /* ================= editor config (STABLE) ================= */
  const arEditorConfig = useMemo(
    () => ({
      language: "ar",
      direction: "rtl" as const,
      placeholder: "",
    }),
    []
  );
    const enEditorConfig = useMemo(
    () => ({
      language: "en",
      direction: "ltr" as const,
      placeholder: "",
    }),
    []
  );

  /* ============== submit ================= */
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

  /* ================= UI ================= */
  return (
    <div className="p-6 w-full space-y-6">
      <h1 className="text-2xl font-bold mainColor">
        Privacy Policy
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <>
          {/* Arabic */}
          <div>
            <label className="block mb-2 font-semibold text-sm">
              Privacy Policy (Arabic)
            </label>

            <CkEditor
              editorData={form.ar}
              handleOnUpdate={(value: string) =>
                setForm((prev) => ({ ...prev, ar: value }))
              }
              config={arEditorConfig}
            />
          </div>

          {/* English */}
          <div>
            <label className="block mb-2 font-semibold text-sm">
              Privacy Policy (English)
            </label>
            {/* <textarea
              value={form.en}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, en: e.target.value }))
              }
              rows={10}
              dir="ltr"
              className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-mainColor"
            /> */}
              <CkEditor
                editorData={form.en}
                handleOnUpdate={(value: string) =>
                  setForm((prev) => ({ ...prev, en: value }))
                }
              config={enEditorConfig}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bkMainColor text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default PrivacyPolicy;










// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import {
//   ActGetPrivacyPolicy,
//   ActUpdatePrivacyPolicy,
// } from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";
// import dynamic from 'next/dynamic';



// const PrivacyPolicy = () => {
//   const CkEditor = dynamic(() => import('../../ckEditor/CKEditor'), {
//     ssr: false, // Disable SSR for this component
// });
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

//   /* ============== submit ================= */
//   const handleSubmit = async () => {
//     try {
      
//       await dispatch(ActUpdatePrivacyPolicy(form)).unwrap();
//       toast.success("Privacy Policy updated successfully");
//     } catch (err: any) {
//       const errors = err?.errors as Record<string, string[] | string> | undefined;

//       if (errors) {
//         Object.values(errors).forEach((value) => {
//           if (Array.isArray(value)) {
//             value.forEach((msg) => toast.error(msg));
//           } else {
//             toast.error(value);
//           }
//         });
//         return;
//       }
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 max-w-5xl space-y-6">
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
//             {/* <textarea
//               value={form.ar}
//               onChange={(e) =>
//                 setForm((prev) => ({ ...prev, ar: e.target.value }))
//               }
//               rows={10}
//               dir="rtl"
//               className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-mainColor"
//             /> */}
//              <CkEditor
//                             editorData={form.ar}
//                             setEditorData={(value: any) => setForm((prev) => ({ ...prev, ar: value }))}
//                             handleOnUpdate={(editor, field) => setForm((prev) => ({ ...prev, ar: editor }))}
//                             config={{
//                                 language: "ar",
//                                 direction: "rtl",
//                                 placeholder: "",
//                                 toolbar: "full",
//                             }}
//                         />
//           </div>

//           {/* English */}
//           <div>
//             <label className="block mb-2 font-semibold text-sm">
//               Privacy Policy (English)
//             </label>
//             <textarea
//               value={form.en}
//               onChange={(e) =>
//                 setForm((prev) => ({ ...prev, en: e.target.value }))
//               }
//               rows={10}
//               dir="ltr"
//               className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-mainColor"
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












// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import {
//   ActGetPrivacyPolicy,
//   ActUpdatePrivacyPolicy,
// } from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";

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

//   /* ============== submit ================= */
//   const handleSubmit = async () => {
//     try {
      
//       await dispatch(ActUpdatePrivacyPolicy(form)).unwrap();
//       toast.success("Privacy Policy updated successfully");
//     } catch (err: any) {
//       const errors = err?.errors as Record<string, string[] | string> | undefined;

//       if (errors) {
//         Object.values(errors).forEach((value) => {
//           if (Array.isArray(value)) {
//             value.forEach((msg) => toast.error(msg));
//           } else {
//             toast.error(value);
//           }
//         });
//         return;
//       }
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 max-w-5xl space-y-6">
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
//             <textarea
//               value={form.ar}
//               onChange={(e) =>
//                 setForm((prev) => ({ ...prev, ar: e.target.value }))
//               }
//               rows={10}
//               dir="rtl"
//               className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-mainColor"
//             />
//           </div>

//           {/* English */}
//           <div>
//             <label className="block mb-2 font-semibold text-sm">
//               Privacy Policy (English)
//             </label>
//             <textarea
//               value={form.en}
//               onChange={(e) =>
//                 setForm((prev) => ({ ...prev, en: e.target.value }))
//               }
//               rows={10}
//               dir="ltr"
//               className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-mainColor"
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



