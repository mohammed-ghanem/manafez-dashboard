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
import {CkEditor} from "../../ckEditor/CKEditorClient";

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
  // useEffect(() => {
  //   dispatch(ActGetPrivacyPolicy());
  // }, [dispatch]);

  useEffect(() => {
    if (!privacyPolicy) {
      dispatch(ActGetPrivacyPolicy());
    }
  }, [privacyPolicy, dispatch]);

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