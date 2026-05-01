import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    return token ? { token, role, name, permissions } : null;
  });

  const login = ({ token, role, name, permissions = [] }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('permissions', JSON.stringify(permissions));
    setUser({ token, role, name, permissions });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const hasPermission = (permission) => Boolean(user?.permissions?.includes(permission));

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
