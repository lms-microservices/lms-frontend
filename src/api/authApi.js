import axiosInstance from './axiosInstance';

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email, password, role) => {
    const response = await axiosInstance.post('/auth/register', { email, password, role });
    return response.data;
  },

  validateToken: async (token) => {
    const response = await axiosInstance.get('/auth/validate', { params: { token } });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
