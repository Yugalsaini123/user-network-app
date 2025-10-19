// ==================== frontend/src/services/api.js ====================
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },

  linkUsers: async (userId, targetUserId) => {
    await api.post(`/users/${userId}/link`, { targetUserId });
  },

  unlinkUsers: async (userId, targetUserId) => {
    await api.delete(`/users/${userId}/unlink`, { data: { targetUserId } });
  },

  addHobby: async (userId, hobby) => {
    const response = await api.post(`/users/${userId}/hobby`, { hobby });
    return response.data;
  },

  getGraphData: async () => {
    const response = await api.get('/graph');
    return response.data;
  }
};

export default api;