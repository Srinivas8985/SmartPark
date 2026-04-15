import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { STORAGE_KEYS } from '../services/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem(STORAGE_KEYS.TOKEN, res.data.token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(res.data.user));
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    setUser(res.data.user);
    localStorage.setItem(STORAGE_KEYS.TOKEN, res.data.token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
