import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  cpf: string;
  email: string;
  birthDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, cpf: string, email: string, password: string, birthDate: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[email];

    if (userData && userData.password === password) {
      const user = { 
        name: userData.name, 
        cpf: userData.cpf, 
        email, 
        birthDate: userData.birthDate 
      };
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = (name: string, cpf: string, email: string, password: string, birthDate: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email]) {
      return { success: false, error: 'Email já cadastrado' };
    }

    // Validar CPF (apenas dígitos)
    const cpfClean = cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      return { success: false, error: 'CPF inválido' };
    }

    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    if (age < 18) {
      return { success: false, error: 'Você precisa ter 18 anos ou mais para se cadastrar' };
    }

    users[email] = { name, cpf: cpfClean, password, birthDate };
    localStorage.setItem('users', JSON.stringify(users));

    const user = { name, cpf: cpfClean, email, birthDate };
    setUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
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
