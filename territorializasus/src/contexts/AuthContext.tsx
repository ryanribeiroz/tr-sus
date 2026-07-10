// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthService } from '@/services/AuthService';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
}

interface AuthContextType extends AuthState {
  login: (cpf: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    userId: null,
    userName: null,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const session = await AuthService.getActiveSession();
      setState({
        isLoading: false,
        isAuthenticated: session.isAuthenticated,
        userId: session.userId || null,
        userName: session.userName || null,
      });
    } catch {
      setState({ isLoading: false, isAuthenticated: false, userId: null, userName: null });
    }
  };

  const login = useCallback(async (cpf: string, password: string) => {
    const result = await AuthService.login(cpf, password);
    if (result.success) {
      setState({
        isLoading: false,
        isAuthenticated: true,
        userId: result.userId || null,
        userName: result.userName || null,
      });
    }
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setState({ isLoading: false, isAuthenticated: false, userId: null, userName: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
