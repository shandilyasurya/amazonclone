import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: { message: '', type: '', isVisible: false },
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isVisible: true,
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  }
});

export const { showToast, hideToast, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
