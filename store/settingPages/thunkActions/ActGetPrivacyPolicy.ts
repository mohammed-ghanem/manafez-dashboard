/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
/**
 * GET privacy policy
 */

 interface SettingValue {
    ar: string ;
    en?: string;
  }
  
  export interface SettingsState {
    privacyPolicy: SettingValue | null;
    loading: boolean;
    error: string | null;
  }
  


// export const ActGetPrivacyPolicy = createAsyncThunk(
//   "settings/getPrivacyPolicy",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/settings?key=privacy-policy",
//         {},
//         { params: { key: "privacy-policy" } }
//       );

//       return res.data.data.setting.value as SettingValue;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Fetch failed");
//     }
//   }
// );



export const ActGetPrivacyPolicy = createAsyncThunk<
  SettingValue,
  void,
  { state: { settings: SettingsState } }
>(
  "settings/getPrivacyPolicy",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { privacyPolicy } = getState().settings;

      // ✅ already fetched → skip API call
      if (privacyPolicy) {
        return privacyPolicy;
      }

      const res = await api.post(
        "/settings",
        {},
        { params: { key: "privacy-policy" } }
      );

      return res.data.data.setting.value as SettingValue;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);




/**
 * UPDATE privacy policy
 */
export const ActUpdatePrivacyPolicy = createAsyncThunk(
  "settings/updatePrivacyPolicy",
  async (value: SettingValue, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/settings?key=privacy-policy",
        { value },
        { params: { key: "privacy-policy" } }
      );

      return res.data.data.setting.value as SettingValue;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);
