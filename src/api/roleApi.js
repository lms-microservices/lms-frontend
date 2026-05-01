import axiosInstance from './axiosInstance';
import { API_BASE_URL } from '../utils/constants';

export const roleApi = {
  getRoles: async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/auth/roles`);
    return response.data;
  },

  getPermissions: async () => {
    const response = await axiosInstance.get(`${API_BASE_URL}/auth/roles/permissions`);
    return response.data;
  },

  createRole: async ({ name, permissionIds = [] }) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/roles`, {
      name,
      permissionIds,
    });
    return response.data;
  },

  createPermission: async ({ name, description }) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/roles/permissions`, {
      name,
      description,
    });
    return response.data;
  },

  addPermissionToRole: async (roleId, permissionId) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/roles/${roleId}/permissions`, [
      permissionId,
    ]);
    return response.data;
  },

  removePermissionFromRole: async (roleId, permissionId) => {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/auth/roles/${roleId}/permissions/${permissionId}`
    );
    return response.data;
  },

  deleteRole: async (roleId) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/auth/roles/${roleId}`);
    return response.data;
  },

  assignRoleToUser: async (userId, roleId) => {
    const response = await axiosInstance.put(`${API_BASE_URL}/auth/users/${userId}/role`, {
      roleId,
    });
    return response.data;
  },
};
