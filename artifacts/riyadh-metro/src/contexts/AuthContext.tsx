import React, { createContext, useContext, useState, ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  rewardPoints: number;
  createdAt: string;
};

export type RedeemedReward = {
  rewardId: string;
  code: string;
  redeemedAt: string;
};

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  rewardPoints: number;
  createdAt: string;
  redeemedRewards: RedeemedReward[];
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: { name?: string; email?: string }) => Promise<void>;
  redeemReward: (rewardId: string, pointsCost: number) => Promise<RedeemedReward>;
  getRedeemedRewards: () => RedeemedReward[];
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "riyadh_metro_user";
const USERS_DB_KEY = "riyadh_metro_users";

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function generateCode(rewardId: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RM-${rewardId.toUpperCase().slice(0, 3)}-${code}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession);

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");

    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      rewardPoints: found.rewardPoints,
      createdAt: found.createdAt,
    };
    writeSession(authUser);
    setUser(authUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = readUsers();
    if (users.find((u) => u.email === email)) {
      throw new Error("An account with this email already exists");
    }

    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 11),
      name,
      email,
      password,
      rewardPoints: 100,
      createdAt: new Date().toISOString(),
      redeemedRewards: [],
    };

    users.push(newUser);
    writeUsers(users);

    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      rewardPoints: newUser.rewardPoints,
      createdAt: newUser.createdAt,
    };
    writeSession(authUser);
    setUser(authUser);
  };

  const logout = () => {
    writeSession(null);
    setUser(null);
  };

  const updateUser = async (updates: { name?: string; email?: string }) => {
    if (!user) throw new Error("Not authenticated");

    const users = readUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) throw new Error("User record not found");

    if (updates.email && updates.email !== user.email) {
      const conflict = users.find((u) => u.email === updates.email && u.id !== user.id);
      if (conflict) throw new Error("That email address is already in use");
    }

    users[idx] = { ...users[idx], ...updates };
    writeUsers(users);

    const updated: AuthUser = {
      ...user,
      name: updates.name ?? user.name,
      email: updates.email ?? user.email,
    };
    writeSession(updated);
    setUser(updated);
  };

  const redeemReward = async (rewardId: string, pointsCost: number): Promise<RedeemedReward> => {
    if (!user) throw new Error("Not authenticated");

    const users = readUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) throw new Error("User record not found");

    const storedUser = users[idx];

    const already = storedUser.redeemedRewards.find((r) => r.rewardId === rewardId);
    if (already) return already;

    if (storedUser.rewardPoints < pointsCost) {
      throw new Error(`Not enough points. You need ${pointsCost} points but have ${storedUser.rewardPoints}.`);
    }

    const entry: RedeemedReward = {
      rewardId,
      code: generateCode(rewardId),
      redeemedAt: new Date().toISOString(),
    };

    users[idx].redeemedRewards.push(entry);
    users[idx].rewardPoints -= pointsCost;
    writeUsers(users);

    const updated: AuthUser = { ...user, rewardPoints: users[idx].rewardPoints };
    writeSession(updated);
    setUser(updated);

    return entry;
  };

  const getRedeemedRewards = (): RedeemedReward[] => {
    if (!user) return [];
    const users = readUsers();
    const stored = users.find((u) => u.id === user.id);
    return stored?.redeemedRewards ?? [];
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser, redeemReward, getRedeemedRewards, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
