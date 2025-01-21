"use client";
import { useState, ReactNode, useEffect, createContext, useContext } from "react";

interface AuthContextType {
  token: string | null;
  login: (_newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getTokenFromCookie = async () => {
      const token = await fetch("/api/auth/token").then((res) => res.json());
      if (token) {
        setToken(token.token);
      }
    };

    getTokenFromCookie();
  }, []);

  const login = async (newToken: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: newToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to set authentication token");
      }
      setToken(newToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
