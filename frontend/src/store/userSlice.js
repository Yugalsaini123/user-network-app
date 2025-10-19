// ==================== frontend/src/store/userSlice.js ====================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../services/api.js';

const initialState = {
  users: [],
  edges: [],
  selectedUser: null,
  loading: false,
  error: null,
  history: [],
  historyIndex: -1
};

// Async thunks
export const fetchGraphData = createAsyncThunk('users/fetchGraphData', async () => await userAPI.getGraphData());
export const createUser = createAsyncThunk('users/createUser', async (userData) => await userAPI.createUser(userData));
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }) => await userAPI.updateUser(id, data));
export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => { await userAPI.deleteUser(id); return id; });
export const linkUsers = createAsyncThunk('users/linkUsers', async ({ userId, targetUserId }) => { await userAPI.linkUsers(userId, targetUserId); return { userId, targetUserId }; });
export const unlinkUsers = createAsyncThunk('users/unlinkUsers', async ({ userId, targetUserId }) => { await userAPI.unlinkUsers(userId, targetUserId); return { userId, targetUserId }; });
export const addHobbyToUser = createAsyncThunk('users/addHobbyToUser', async ({ userId, hobby }) => await userAPI.addHobby(userId, hobby));

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    saveToHistory: (state) => {
      const snapshot = {
        users: JSON.parse(JSON.stringify(state.users)),
        edges: JSON.parse(JSON.stringify(state.edges))
      };
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(snapshot);
      state.historyIndex = state.history.length - 1;
      if (state.history.length > 50) {
        state.history = state.history.slice(-50);
        state.historyIndex = state.history.length - 1;
      }
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const previous = state.history[state.historyIndex];
        state.users = previous.users;
        state.edges = previous.edges;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const next = state.history[state.historyIndex];
        state.users = next.users;
        state.edges = next.edges;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGraphData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.edges = action.payload.edges;
      })
      .addCase(fetchGraphData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.selectedUser?.id === action.payload.id) state.selectedUser = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) state.selectedUser = null;
      })
      .addCase(linkUsers.fulfilled, (state, action) => {
        const { userId, targetUserId } = action.payload;
        const [user1, user2] = [userId, targetUserId].sort();
        state.edges.push({ id: `${user1}-${user2}`, source: user1, target: user2 });
      })
      .addCase(unlinkUsers.fulfilled, (state, action) => {
        const { userId, targetUserId } = action.payload;
        state.edges = state.edges.filter(e => 
          !((e.source === userId && e.target === targetUserId) || 
            (e.source === targetUserId && e.target === userId))
        );
      })
      .addCase(addHobbyToUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.selectedUser?.id === action.payload.id) state.selectedUser = action.payload;
      });
  }
});

export const { setSelectedUser, clearError, saveToHistory, undo, redo } = userSlice.actions;
export const canUndo = (state) => state.users.historyIndex > 0;
export const canRedo = (state) => state.users.historyIndex < state.users.history.length - 1;
export default userSlice.reducer;