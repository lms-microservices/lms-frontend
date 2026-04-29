import { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((r) => setTimeout(r, 500));
        setStats({
          enrolled: 3,
          completed: 1,
          inProgress: 2,
        });
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full w-8 h-8 border-2 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Track your learning progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{stats?.enrolled}</p>
          <p className="text-sm text-gray-500 mt-1">Enrolled Courses</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{stats?.inProgress}</p>
          <p className="text-sm text-gray-500 mt-1">In Progress</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{stats?.completed}</p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">My Courses</h2>
        <p className="text-sm text-gray-400">No courses enrolled yet.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
