"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, user as mockUser } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if user is "logged in" from a previous session
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, pass: string) => {
    // Mock login logic
    if (email && pass) {
        const loggedInUser = mockUser;
        setUser(loggedInUser);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        toast({ title: 'Login Successful', description: `Welcome back, ${loggedInUser.name}!` });
        router.push('/account');
    } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Please check your credentials.' });
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
