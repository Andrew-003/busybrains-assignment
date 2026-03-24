import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Don't call logout here directly to avoid circular dependency
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    // Check if this is OAuth2 login (has token and user data)
    if (credentials.token && credentials.username) {
      // OAuth2 login - token and user data already provided
      localStorage.setItem('token', credentials.token);
      const { token, ...userData } = credentials;
      setUser(userData);
      return { success: true };
    } else {
      // Regular login - need to call authService.login
      try {
        const response = await authService.login(credentials);
        const { token, ...userData } = response;

        localStorage.setItem('token', token);
        setUser(userData);

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
        };
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, ...user } = response;

      localStorage.setItem('token', token);
      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const handleOAuth2Success = (token) => {
    localStorage.setItem('token', token);
    fetchCurrentUser();
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    handleOAuth2Success
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
