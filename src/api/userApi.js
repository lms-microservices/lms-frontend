import axiosInstance from './axiosInstance';
import { API_BASE_URL } from '../utils/constants';

export const userApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
  },

  updateRole: async (id, role) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/users/${id}/role`, { role });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/auth/users/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/users/stats`);
    return response.data;
  },
};
