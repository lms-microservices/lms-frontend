import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    return token ? { token, role, name, permissions } : null;
  });

  const [isAuthLoading, setIsAuthLoading] = useState(!!localStorage.getItem('token'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      setIsAuthLoading(false);
      return;
    }

    const validate = async () => {
      try {
        await authApi.validateToken(user.token);
      } catch {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const { data } = await authApi.refresh(refreshToken);
            localStorage.setItem('token', data.accessToken);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            setUser((prev) => prev ? { ...prev, token: data.accessToken } : null);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('name');
            localStorage.removeItem('permissions');
            setUser(null);
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('name');
          localStorage.removeItem('permissions');
          setUser(null);
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    validate();
  }, []);

  const login = useCallback(({ token, refreshToken, role, name, permissions = [] }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('permissions', JSON.stringify(permissions));
    setUser({ token, role, name, permissions });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('permissions');
    setUser(null);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      if (updated.token) localStorage.setItem('token', updated.token);
      if (updated.permissions) localStorage.setItem('permissions', JSON.stringify(updated.permissions));
      return updated;
    });
  }, []);

  const refreshAuthToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) return null;

    try {
      const response = await authApi.refresh(storedRefreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response;

      localStorage.setItem('token', accessToken);
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

      setUser((prev) => prev ? { ...prev, token: accessToken } : null);
      return accessToken;
    } catch {
      return null;
    }
  }, []);

  const hasPermission = useCallback((permission) => Boolean(user?.permissions?.includes(permission)), [user?.permissions]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAuthToken, updateUser, hasPermission, isAuthLoading, isRefreshing, setIsRefreshing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
