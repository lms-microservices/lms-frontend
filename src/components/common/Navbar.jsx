import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../store/AuthContext';
import RoleBadge from './RoleBadge';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <Link to="/" className="text-lg font-semibold text-gray-900">
        LMS Platform
      </Link>

      <div className="flex items-center gap-4">
        <RoleBadge role={user.role} />
        <span className="text-sm text-gray-600">{user.name}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
