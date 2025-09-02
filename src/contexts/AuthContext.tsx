'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setState(prev => ({
            ...prev,
            user: {
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at,
            },
            loading: false,
          }));
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setState({
            user: {
              id: session.user.id,
              email: session.user.email!,
              created_at: session.user.created_at,
            },
            loading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to login',
        loading: false,
      }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to register',
        loading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to logout',
        loading: false,
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
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

