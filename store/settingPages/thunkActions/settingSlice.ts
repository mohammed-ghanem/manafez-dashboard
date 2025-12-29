import { createSlice } from "@reduxjs/toolkit";
import { ActGetPrivacyPolicy, ActUpdatePrivacyPolicy, SettingsState } from "./ActGetPrivacyPolicy";


const initialState: SettingsState = {
  privacyPolicy: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(ActGetPrivacyPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(ActGetPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacyPolicy = action.payload;
      })
      .addCase(ActGetPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(ActUpdatePrivacyPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(ActUpdatePrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacyPolicy = action.payload;
      })
      .addCase(ActUpdatePrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default settingsSlice.reducer;
