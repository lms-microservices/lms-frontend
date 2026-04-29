import axiosInstance from './axiosInstance';
import { API_BASE_URL } from '../utils/constants';

export const auditApi = {
  getLogs: async (params = {}) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/audit`, { params });
    return response.data;
  },

  getLogById: async (id) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/audit/${id}`);
    return response.data;
  },
};
