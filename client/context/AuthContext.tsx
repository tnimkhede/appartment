import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@/data/mockData';
import { authService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@apt_manager_auth';
const TOKEN_STORAGE_KEY = 'token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        // Verify token and get user data
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          // Token invalid or expired
          await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.login(email, password);

      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        unitNumber: response.unitNumber,
        phone: response.phone,
        // password field is not returned by API and not needed in state
      } as User;

      setUser(userData);
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getRoleColor(role: UserRole, isDark: boolean = false): string {
  const colors = {
    resident: isDark ? '#34D399' : '#10B981',
    management: isDark ? '#A78BFA' : '#8B5CF6',
    security: isDark ? '#FBBF24' : '#F59E0B',
    maintenance: isDark ? '#60A5FA' : '#3B82F6',
  };
  return colors[role];
}

export function getRoleLabel(role: UserRole): string {
  const labels = {
    resident: 'Resident',
    management: 'Management',
    security: 'Security',
    maintenance: 'Maintenance',
  };
  return labels[role];
}
