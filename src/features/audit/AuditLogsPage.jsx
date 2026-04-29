import { useState, useEffect } from 'react';
import { auditApi } from '../../api/auditApi';
import { ROLES } from '../../utils/constants';
import Loader from '../../components/common/Loader';

const ACTION_COLORS = {
  LOGIN: 'bg-green-50 text-green-700 border-green-200',
  LOGOUT: 'bg-gray-50 text-gray-600 border-gray-200',
  REGISTER: 'bg-blue-50 text-blue-700 border-blue-200',
  ROLE_CHANGE: 'bg-red-50 text-red-700 border-red-200',
  ACCESS_DENIED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  DEFAULT: 'bg-gray-50 text-gray-600 border-gray-200',
};

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    resource: '',
    page: 0,
    size: 20,
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.userId) params.userId = filters.userId;
      if (filters.action) params.action = filters.action;
      if (filters.resource) params.resource = filters.resource;
      params.page = filters.page;
      params.size = filters.size;

      const data = await auditApi.getLogs(params);
      setLogs(data.items || data);
      setTotal(data.total || data.length || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters.page]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-500 mt-1">Track user actions and system events</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">User ID</label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Filter by user"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="REGISTER">Register</option>
              <option value="ROLE_CHANGE">Role Change</option>
              <option value="ACCESS_DENIED">Access Denied</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Resource</label>
            <input
              type="text"
              value={filters.resource}
              onChange={(e) => handleFilterChange('resource', e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="e.g. /api/users"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Resource</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-400">
                        No audit logs found
                      </td>
                    </tr>
                  )}
                  {logs.map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900 font-medium">{log.userName || log.userId || 'System'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${ACTION_COLORS[log.action] || ACTION_COLORS.DEFAULT}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{log.resource || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${log.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {log.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > filters.size && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Showing {logs.length} of {total} entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                    disabled={filters.page === 0}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                    disabled={(filters.page + 1) * filters.size >= total}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
