import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import {
  authService,
  type User,
  type LoginCredentials,
  type RegisterCredentials,
} from '../lib/authService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const userData = await authService.getProfile(token);
          setUser(userData);
        } catch (error) {
          console.error(error);
          authService.removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    authService.saveToken(response.access_token);
    setUser(response.user);
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await authService.register(credentials);
    authService.saveToken(response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
