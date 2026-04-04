import { Navigate } from 'react-router';
import { useAuth } from '../store/AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default RoleBasedRoute;