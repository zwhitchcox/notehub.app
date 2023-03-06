import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  collapsed: boolean;
}

const initialState: SidebarState = {
  collapsed: true,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
  },
});

export const { toggleCollapsed, setCollapsed } = sidebarSlice.actions;

export default sidebarSlice.reducer;

