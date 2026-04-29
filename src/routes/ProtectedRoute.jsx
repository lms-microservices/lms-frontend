import { Navigate } from 'react-router';
import { useAuth } from '../store/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;