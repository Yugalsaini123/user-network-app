//src/store/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showUserPanel: false,
  panelMode: null,
  searchQuery: '',
  filterHobby: null,
  editingUser: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreatePanel: (state) => {
      state.showUserPanel = true;
      state.panelMode = 'create';
      state.editingUser = null;
    },
    openEditPanel: (state, action) => {
      state.showUserPanel = true;
      state.panelMode = 'edit';
      state.editingUser = action.payload;
    },
    closePanel: (state) => {
      state.showUserPanel = false;
      state.panelMode = null;
      state.editingUser = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterHobby: (state, action) => {
      state.filterHobby = action.payload;
    },
    setEditingUser: (state, action) => {
      state.editingUser = action.payload;
      state.showUserPanel = true;
      state.panelMode = action.payload === 'new' ? 'create' : 'edit';
    }
  }
});

export const {
  openCreatePanel,
  openEditPanel,
  closePanel,
  setSearchQuery,
  setFilterHobby,
  setEditingUser
} = uiSlice.actions;

export default uiSlice.reducer;