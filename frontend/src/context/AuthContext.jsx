import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('admission_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem('admission_token');
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to verify token:', err);
      localStorage.removeItem('admission_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        localStorage.setItem('admission_token', res.data.token);
        setUser(res.data);
        return { success: true };
      }
      return { success: false, message: res.message || 'Authentication failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Network error during login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admission_token');
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  const isCounsellor = user?.role === 'counsellor';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isSuperAdmin,
        isCounsellor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

