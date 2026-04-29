import axiosInstance from './axiosInstance';
import { API_BASE_URL } from '../utils/constants';

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  register: async (email, password, role) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      role,
    });
    return response.data;
  },

  validateToken: async (token) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/auth/validate`, {
      params: { token },
    });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    return response.data;
  },
};