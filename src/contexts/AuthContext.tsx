import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  cpf: string;
  phone: string;
  birthDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkAndSetUser(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAndSetUser(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAndSetUser = async (supabaseUser: SupabaseUser) => {
    try {
      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .eq('role', 'admin')
        .single();

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        isAdmin: !!roleData,
      });
    } catch (error) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        isAdmin: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Erro ao fazer login');

      // Check if admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single();

      const isAdmin = !!roleData;

      setUser({
        id: data.user.id,
        email: data.user.email || '',
        isAdmin,
      });

      return { success: true, isAdmin };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao fazer login' };
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      if (!authData.user) throw new Error('Erro ao criar conta');

      // Create profile with additional data
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            name: data.name,
            cpf: data.cpf,
            phone: data.phone,
            birth_date: data.birthDate,
          },
        ]);

      if (profileError) throw profileError;

      setUser({
        id: authData.user.id,
        email: authData.user.email || '',
        isAdmin: false,
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao criar conta' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
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
