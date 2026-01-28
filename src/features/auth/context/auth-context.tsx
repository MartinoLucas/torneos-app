"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  token: string | null;
  role: "admin" | "participant" | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: "admin" | "participant") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ token: null, role: null, isAuthenticated: false });
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("auth_token_admin");
    const participantToken = localStorage.getItem("auth_token_participant");

    if (adminToken) setAuth({ token: adminToken, role: "admin", isAuthenticated: true });
    else if (participantToken) setAuth({ token: participantToken, role: "participant", isAuthenticated: true });
  }, []);

  const login = (token: string, role: "admin" | "participant") => {
    localStorage.setItem(role === "admin" ? "auth_token_admin" : "auth_token_participant", token);
    setAuth({ token, role, isAuthenticated: true });
    router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, isAuthenticated: false });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};