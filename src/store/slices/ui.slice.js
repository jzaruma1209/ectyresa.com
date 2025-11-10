import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  modal: {
    isOpen: false,
    type: null, // 'cart', 'product', etc.
    data: null,
  },
  sidebar: {
    isOpen: false,
  },
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    openSidebar: (state) => {
      state.sidebar.isOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebar.isOpen = false;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  openModal,
  closeModal,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;

