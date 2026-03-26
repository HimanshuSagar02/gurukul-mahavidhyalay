import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/client';

const AuthContext = createContext(null);
const authHintKey = 'gurukul_admin_session_hint';

const getAuthHint = () => {
  try {
    return window.localStorage.getItem(authHintKey) === '1';
  } catch {
    return false;
  }
};

const setAuthHint = (value) => {
  try {
    if (value) {
      window.localStorage.setItem(authHintKey, '1');
      return;
    }

    window.localStorage.removeItem(authHintKey);
  } catch {}
};

const isLoginRoute = (pathname = '') => pathname === '/login' || pathname === '/admin/login';
const isProtectedAdminRoute = (pathname = '') => pathname.startsWith('/admin') && !isLoginRoute(pathname);

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(
    () => isProtectedAdminRoute(location.pathname) || (isLoginRoute(location.pathname) && getAuthHint())
  );

  const refreshAuth = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/auth/me');
      setUser(data.user);
      setAuthHint(true);
    } catch (error) {
      setUser(null);
      setAuthHint(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const shouldProbeAuth = isProtectedAdminRoute(location.pathname) || (isLoginRoute(location.pathname) && getAuthHint());

    if (!shouldProbeAuth || user) {
      setLoading(false);
      return;
    }

    refreshAuth();
  }, [location.pathname, user]);

  const login = async (payload) => {
    const data = await api.post('/admin/auth/login', payload);
    setUser(data.user);
    setAuthHint(true);
    return data.user;
  };

  const logout = async () => {
    await api.post('/admin/auth/logout', {});
    setUser(null);
    setAuthHint(false);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshAuth
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
