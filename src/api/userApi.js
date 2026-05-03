import axiosInstance from './axiosInstance';

export const userApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  updateRole: async (id, role) => {
    const response = await axiosInstance.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  },

  updateProfile: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },
};
