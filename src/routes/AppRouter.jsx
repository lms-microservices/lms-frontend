import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../utils/constants';

import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import AdminLayout from '../layouts/AdminLayout';
import InstructorLayout from '../layouts/InstructorLayout';
import StudentLayout from '../layouts/StudentLayout';

import AdminDashboard from '../features/dashboard/AdminDashboard';
import InstructorDashboard from '../features/dashboard/InstructorDashboard';
import StudentDashboard from '../features/dashboard/StudentDashboard';
import AuditLogsPage from '../features/audit/AuditLogsPage';
import UserManagement from '../features/dashboard/UserManagement';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit" element={<AuditLogsPage />} />
      </Route>

      <Route path="/instructor" element={
        <RoleBasedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
          <InstructorLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="courses" element={<div className="text-gray-500 text-sm p-4">Courses feature coming soon</div>} />
      </Route>

      <Route path="/student" element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout />
        </RoleBasedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<div className="text-gray-500 text-sm p-4">My Courses coming soon</div>} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900">403</h1><p className="text-gray-500 mt-2">Access Denied</p></div></div>} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;