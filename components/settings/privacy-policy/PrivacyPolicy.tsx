"use client";

import { useEffect, useState } from "react";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "@/store/settings/privacyPolicyApi";
import { toast } from "sonner";
// import PrivacyPolicySkeleton from "./PrivacyPolicySkeleton";
// import CkEditor from "@/components/ckEditor/CKEditor";

import dynamic from "next/dynamic";
import PrivacyPolicySkeleton, {
  PrivacyPolicyEditorSkeleton,
} from "./PrivacyPolicySkeleton";

const CkEditor = dynamic(() => import("@/components/ckEditor/CKEditor"), {
  ssr: false,
  loading: () => <PrivacyPolicyEditorSkeleton />,
});

export default function PrivacyPolicy() {
  const { data, isLoading } = useGetPrivacyPolicyQuery();
  const [updatePolicy, { isLoading: isSaving }] =
    useUpdatePrivacyPolicyMutation();

  const [form, setForm] = useState({ ar: "", en: "" });

  useEffect(() => {
    if (!data) return;
    setForm({
      ar: data.ar ?? "",
      en: data.en ?? "",
    });
  }, [data?.ar, data?.en]);

  const isPageLoading = isLoading || !data;

  if (isPageLoading) {
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
    <div className="p-6 mx-4 my-10 space-y-6 bg-white rounded-2xl border border-solid border-[#ddd]">
      <h3 className=" font-bold titleStyle cairo-font">سياسة الخصوصية</h3>

      {!data ? (
        <>
          <PrivacyPolicyEditorSkeleton />
          <PrivacyPolicyEditorSkeleton />
        </>
      ) : (
        <>
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
          <button onClick={submit} disabled={isSaving} className="submitButton">
            حفظ
          </button>
        </>
      )}
    </div>
  );
}
