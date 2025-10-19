// ==================== frontend/src/services/api.js ====================
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const userAPI = {
  getAllUsers: async () => (await api.get('/users')).data,
  getUserById: async (id) => (await api.get(`/users/${id}`)).data,
  createUser: async (userData) => (await api.post('/users', userData)).data,
  updateUser: async (id, userData) => (await api.put(`/users/${id}`, userData)).data,
  deleteUser: async (id) => await api.delete(`/users/${id}`),
  linkUsers: async (userId, targetUserId) => await api.post(`/users/${userId}/link`, { targetUserId }),
  unlinkUsers: async (userId, targetUserId) => await api.delete(`/users/${userId}/unlink`, { data: { targetUserId } }),
  addHobby: async (userId, hobby) => (await api.post(`/users/${userId}/hobby`, { hobby })).data,
  getGraphData: async () => (await api.get('/graph')).data
};

export default api;