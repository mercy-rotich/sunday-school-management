import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UiState } from "@/types";

const initialState: UiState = {
  sidebarCollapsed: false,
  activeNav: "dashboard",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveNav(state, action: PayloadAction<string>) {
      state.activeNav = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveNav } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
