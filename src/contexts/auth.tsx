'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type UserRole = 'Admin' | 'Student' | 'Super Admin' | 'Moderator';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const allUsers: Record<UserRole, User> = {
  Student: {
    id: 'student123',
    name: 'Student User',
    email: 'student@university.edu',
    role: 'Student',
  },
  Moderator: {
    id: 'moderator123',
    name: 'Moderator User',
    email: 'moderator@university.edu',
    role: 'Moderator'
  },
  Admin: {
    id: 'admin456',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'Admin',
  },
  'Super Admin': {
    id: 'superadmin789',
    name: 'Super Admin User',
    email: 'superadmin@university.edu',
    role: 'Super Admin',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((role: UserRole) => {
    const userToLogin = allUsers[role];
    if (userToLogin) {
      localStorage.setItem('user', JSON.stringify(userToLogin));
      setUser(userToLogin);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    if (user && allUsers[role]) {
      const updatedUser = { ...allUsers[role], id: user.id }; // Keep the same user, just change role for demo
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
