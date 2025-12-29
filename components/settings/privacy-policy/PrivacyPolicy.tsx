"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import LangUseParams from "@/translate/LangUseParams";
import { ActGetPrivacyPolicy, ActUpdatePrivacyPolicy } from "@/store/settingPages/thunkActions/ActGetPrivacyPolicy";

const PrivacyPolicy = () => {
  const dispatch = useAppDispatch();
  const lang = LangUseParams() // "ar" | "en"

  const { privacyPolicy, loading } = useAppSelector(
    (state) => state.settings
  );

  const [content, setContent] = useState("");

  // fetch data
  useEffect(() => {
    dispatch(ActGetPrivacyPolicy());
  }, [dispatch]);

  // sync store → input (only selected language)
  useEffect(() => {
    if (privacyPolicy && lang) {
      setContent(privacyPolicy[lang] || "");
    }
  }, [privacyPolicy, lang]);

  const handleSubmit = async () => {
    if (!privacyPolicy) return;

    try {
      await dispatch(
        ActUpdatePrivacyPolicy({
          ...privacyPolicy,
          [lang]: content, // update only current lang
        })
      ).unwrap();

      toast.success("Privacy Policy updated");
    } catch (err: any) {
      toast.error(err || "Update failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 mainColor">
        Privacy Policy ({lang.toUpperCase()})
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-mainColor"
            placeholder="Write privacy policy content..."
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bkMainColor text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
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
