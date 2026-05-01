import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../store/AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleBasedRoute;
