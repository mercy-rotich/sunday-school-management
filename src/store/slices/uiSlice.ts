import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UiState } from "@/types";

const initialState: UiState = {
  sidebarCollapsed: false,
  activeNav: "dashboard",
  darkMode: false,
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
    initDarkMode(state) {
      state.darkMode = true;
      document.documentElement.classList.add('dark');
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleSidebar, setActiveNav, initDarkMode, toggleDarkMode } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
