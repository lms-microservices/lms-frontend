import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { ROLES } from '../../utils/constants';
import RoleBadge from '../../components/common/RoleBadge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      const data = await userApi.getAll(params);
      setUsers(data.items || data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userApi.updateRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      setError('Failed to update role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userApi.delete(userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage users and their roles</p>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All roles</option>
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.INSTRUCTOR}>Instructor</option>
          <option value={ROLES.STUDENT}>Student</option>
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-sm text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                        >
                          <option value={ROLES.STUDENT}>Student</option>
                          <option value={ROLES.INSTRUCTOR}>Instructor</option>
                          <option value={ROLES.ADMIN}>Admin</option>
                        </select>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
