import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole, USERS } from '@/data/mockData';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        const validUser = USERS.find(u => u.id === userData.id);
        if (validUser) {
          setUser(validUser);
        }
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const foundUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = async () => {
    setUser(null);
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
