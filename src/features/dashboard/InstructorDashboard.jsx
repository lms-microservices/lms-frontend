import { useState, useEffect } from 'react';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((r) => setTimeout(r, 500));
        setStats({
          courses: 5,
          students: 42,
          pending: 3,
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
        <h1 className="text-xl font-semibold text-gray-900">Instructor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your courses and students</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{stats?.courses}</p>
          <p className="text-sm text-gray-500 mt-1">Active Courses</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{stats?.students}</p>
          <p className="text-sm text-gray-500 mt-1">Enrolled Students</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100">
          <p className="text-2xl font-semibold text-gray-900">{stats?.pending}</p>
          <p className="text-sm text-gray-500 mt-1">Pending Reviews</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition">
            Create Course
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
            View Students
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
