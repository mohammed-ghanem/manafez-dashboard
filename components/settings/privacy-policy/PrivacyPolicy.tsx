"use client";

import { useEffect, useState } from "react";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/store/settings/privacyPolicyApi";
import { toast } from "sonner";
import PrivacyPolicySkeleton from "./PrivacyPolicySkeleton";
import CkEditor from "@/components/ckEditor/CKEditor";

export default function PrivacyPolicy() {
  const { data, isLoading } = useGetPrivacyPolicyQuery();
  const [updatePolicy, { isLoading: isSaving }] =
    useUpdatePrivacyPolicyMutation();

  const [form, setForm] = useState({ ar: "", en: "" });

  useEffect(() => {
    if (data) {
      setForm({
        ar: data.ar ?? "",
        en: data.en ?? "",
      });
    }
  }, [data]);

  if (isLoading) {
    return <PrivacyPolicySkeleton />;
  }

  const submit = async () => {
    try {
      await updatePolicy(form).unwrap();
      toast.success("تم الحفظ بنجاح");
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <>
      <h3 className=" font-bold titleStyle cairo-font">سياسة الخصوصية</h3>
      <div className="m-2">
        <p className="titleDescription">المحتوى العربي</p>
        <CkEditor
          editorData={form.ar}
          handleOnUpdate={(value) =>
            setForm((prev) => ({ ...prev, ar: value }))
          }
          config={{ language: "ar", direction: "rtl" }}
        />
      </div>
      <div className="m-2">
        <p className="titleDescription">المحتوى الانجليزي</p>
        <CkEditor
          editorData={form.en}
          handleOnUpdate={(value) =>
            setForm((prev) => ({ ...prev, en: value }))
          }
          config={{ language: "en", direction: "ltr" }}
        />
      </div>

      <button onClick={submit} disabled={isSaving}>
        حفظ
      </button>
    </>
  );
}






















// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { toast } from "sonner";

// import {
//   ActGetPrivacyPolicy,
//   ActUpdatePrivacyPolicy,
// } from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";

// import { CkEditor } from "../../ckEditor/CKEditorClient";
// import PrivacyPolicyPageSkeleton from "./PrivacyPolicySkeleton";
// import TranslateHook from "@/translate/TranslateHook";

// export default function PrivacyPolicy() {
//   const dispatch = useAppDispatch();
//   const { privacyPolicy, loading } = useAppSelector((state) => state.settings);

//   const translate = TranslateHook();

//   const [form, setForm] = useState({ ar: "", en: "" });

//   useEffect(() => {
//     dispatch(ActGetPrivacyPolicy());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!loading && privacyPolicy) {
//       setForm({
//         ar: privacyPolicy.ar ?? "",
//         en: privacyPolicy.en ?? "",
//       });
//     }
//   }, [loading, privacyPolicy]);

//   const isReady = !loading && !!privacyPolicy;

//   const arEditorConfig = useMemo(
//     () => ({ language: "ar", direction: "rtl" as const }),
//     [],
//   );

//   const enEditorConfig = useMemo(
//     () => ({ language: "en", direction: "ltr" as const }),
//     [],
//   );

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

//   /* ================= HARD RENDER GATE ================= */
//   if (!isReady) {
//     return <PrivacyPolicyPageSkeleton />;
//   }

//   /* ================= FULL PAGE ================= */
//   return (
//     <div className="p-6 mx-4 my-10 space-y-6 bg-white rounded-2xl border border-solid border-[#ddd]">
//       <h3 className=" font-bold titleStyle cairo-font">
//         {translate?.settings.privacyPolicy.title || "Privacy Policy"}
//       </h3>
//       <div className="m-2">
//         <p className="titleDescription">
//           {translate?.settings.privacyPolicy.arabicContent || "Arabic Content"}
//         </p>
//         <CkEditor
//           editorData={form.ar}
//           handleOnUpdate={(value) =>
//             setForm((prev) => ({ ...prev, ar: value }))
//           }
//           config={arEditorConfig}
//         />
//       </div>
//       <div className="m-2 mt-8">
//         <p className="titleDescription">
//           {translate?.settings.privacyPolicy.englishContent ||
//             "English Content"}
//         </p>
//         <CkEditor
//           editorData={form.en}
//           handleOnUpdate={(value) =>
//             setForm((prev) => ({ ...prev, en: value }))
//           }
//           config={enEditorConfig}
//         />
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="submitButton px-6 py-2 rounded-lg"
//       >
//         {translate?.settings.privacyPolicy.saveBtn || "Save"}
//       </button>
//     </div>
//   );
// }
