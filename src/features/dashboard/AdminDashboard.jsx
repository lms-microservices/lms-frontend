import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { ROLES } from '../../utils/constants';
import RoleBadge from '../../components/common/RoleBadge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          userApi.getStats(),
          userApi.getAll({ limit: 5, sort: 'createdAt,desc' }),
        ]);
        setStats(statsRes);
        setRecentUsers(usersRes.items || usersRes);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total || 0, color: 'bg-gray-900' },
    { label: 'Admins', value: stats?.admins || 0, color: 'bg-red-500' },
    { label: 'Instructors', value: stats?.instructors || 0, color: 'bg-blue-500' },
    { label: 'Students', value: stats?.students || 0, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your LMS platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} rounded-lg mb-3`} />
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent Users</h2>
          <Button variant="secondary" size="sm" onClick={() => window.location.href = '/admin/users'}>
            View All
          </Button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentUsers.length === 0 && (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">No users found</p>
          )}
          {recentUsers.map((u) => (
            <div key={u.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
              <div>
                <p className="text-sm font-medium text-gray-900">{u.name || u.email}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <RoleBadge role={u.role} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
