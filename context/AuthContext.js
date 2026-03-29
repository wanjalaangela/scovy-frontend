import { createContext, useContext, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);

  const login = async (username, password) => {
    const res = await api.post('/api/auth/login/', { username, password });
    const accessToken = res.data.access;
    setToken(accessToken);
    setAdmin({ username });
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}