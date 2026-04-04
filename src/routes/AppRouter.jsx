import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../utils/constants';

import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import AdminLayout from '../layouts/AdminLayout';
import InstructorLayout from '../layouts/InstructorLayout';
import StudentLayout from '../layouts/StudentLayout';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin/*" element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </RoleBasedRoute>
      } />

      <Route path="/instructor/*" element={
        <RoleBasedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
          <InstructorLayout />
        </RoleBasedRoute>
      } />

      <Route path="/student/*" element={
        <RoleBasedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentLayout />
        </RoleBasedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div className="text-red-500 text-center mt-20 text-2xl">403 — Access Denied</div>} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;