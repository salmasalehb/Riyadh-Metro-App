import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  rewardPoints: number;
  createdAt: string;
};

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "riyadh_metro_user";
const USERS_DB_KEY = "riyadh_metro_users";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    const usersStr = localStorage.getItem(USERS_DB_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid email or password");
    }

    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      rewardPoints: found.rewardPoints,
      createdAt: found.createdAt
    };

    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const usersStr = localStorage.getItem(USERS_DB_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      rewardPoints: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      rewardPoints: newUser.rewardPoints,
      createdAt: newUser.createdAt
    };

    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
