import { useEffect, useMemo, useState } from 'react';
import { roleApi } from '../../api/roleApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const RolePermissionsManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permissionName, setPermissionName] = useState('');
  const [permissionDescription, setPermissionDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === String(selectedRoleId)),
    [roles, selectedRoleId]
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [nextRoles, nextPermissions] = await Promise.all([
        roleApi.getRoles(),
        roleApi.getPermissions(),
      ]);
      setRoles(nextRoles);
      setPermissions(nextPermissions);
      setSelectedRoleId((current) => current || nextRoles[0]?.id || '');
    } catch (err) {
      setError('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedRolePermissionNames = selectedRole?.permissions || [];
  const availablePermissions = permissions.filter(
    (permission) => !selectedRolePermissionNames.includes(permission.name)
  );

  const createRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    try {
      const role = await roleApi.createRole({ name: roleName.trim().toUpperCase() });
      setRoleName('');
      await loadData();
      setSelectedRoleId(role.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create role');
    }
  };

  const createPermission = async (e) => {
    e.preventDefault();
    if (!permissionName.trim()) return;

    try {
      await roleApi.createPermission({
        name: permissionName.trim(),
        description: permissionDescription.trim(),
      });
      setPermissionName('');
      setPermissionDescription('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create permission');
    }
  };

  const addPermission = async (permissionId) => {
    await roleApi.addPermissionToRole(selectedRole.id, permissionId);
    await loadData();
  };

  const removePermission = async (permission) => {
    await roleApi.removePermissionFromRole(selectedRole.id, permission.id);
    await loadData();
  };

  const deleteRole = async () => {
    if (!selectedRole || selectedRole.static) return;
    if (!window.confirm(`Delete role ${selectedRole.name}?`)) return;

    try {
      await roleApi.deleteRole(selectedRole.id);
      setSelectedRoleId('');
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete role');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Roles & Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage role bundles and their permissions</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
        <section className="bg-white rounded-xl border border-gray-100 p-4">
          <form onSubmit={createRole} className="space-y-3 mb-4">
            <label className="block text-sm font-medium text-gray-700">New role</label>
            <div className="flex gap-2">
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="min-w-0 flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="SUPPORT"
              />
              <Button type="submit" size="sm">Add</Button>
            </div>
          </form>

          <div className="space-y-1">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  String(selectedRoleId) === String(role.id)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{role.name}</span>
                {role.static && <span className="ml-2 text-xs opacity-70">Static</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-4">
          {selectedRole ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedRole.name}</h2>
                  <p className="text-sm text-gray-500">{selectedRole.permissions.length} permissions assigned</p>
                </div>
                {!selectedRole.static && (
                  <Button variant="danger" size="sm" onClick={deleteRole}>Delete role</Button>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.permissions.length === 0 && (
                    <span className="text-sm text-gray-400">No permissions assigned</span>
                  )}
                  {selectedRole.permissions.map((permissionName) => {
                    const permission = permissions.find((p) => p.name === permissionName);
                    return (
                      <button
                        key={permissionName}
                        type="button"
                        onClick={() => permission && removePermission(permission)}
                        className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium"
                      >
                        {permissionName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Available permissions</h3>
                <div className="flex flex-wrap gap-2">
                  {availablePermissions.map((permission) => (
                    <button
                      key={permission.id}
                      type="button"
                      onClick={() => addPermission(permission.id)}
                      className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 text-xs font-medium"
                    >
                      {permission.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={createPermission} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 pt-2">
                <input
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="reports:read"
                />
                <input
                  value={permissionDescription}
                  onChange={(e) => setPermissionDescription(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Description"
                />
                <Button type="submit">Create permission</Button>
              </form>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Select a role</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default RolePermissionsManagement;
