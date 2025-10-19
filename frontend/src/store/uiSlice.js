// ==================== frontend/src/store/uiSlice.js ====================
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showUserPanel: false,
    editingUser: null,
    selectedEdge: null
  },
  reducers: {
    setEditingUser: (state, action) => {
      state.editingUser = action.payload;
      state.showUserPanel = action.payload !== null;
    },
    closePanel: (state) => {
      state.showUserPanel = false;
      state.editingUser = null;
    },
    setSelectedEdge: (state, action) => {
      state.selectedEdge = action.payload;
    }
  }
});

export const { setEditingUser, closePanel, setSelectedEdge } = uiSlice.actions;
export default uiSlice.reducer;