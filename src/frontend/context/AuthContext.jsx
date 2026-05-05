import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trustbridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authError, setAuthError] = useState('');

  
  useEffect(() => {
    const token = localStorage.getItem('trustbridge_token');
    if (!token || user) return;
    api('/api/auth/me').then(payload => setUser(payload.user)).catch(() => logout());
  }, []);

  async function login(email, password) {
    setAuthError('');
    try {
      const payload = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('trustbridge_token', payload.token);
      localStorage.setItem('trustbridge_user', JSON.stringify(payload.user));
      setUser(payload.user);
      return payload.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem('trustbridge_token');
    localStorage.removeItem('trustbridge_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, authError, login, logout }), [user, authError]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
