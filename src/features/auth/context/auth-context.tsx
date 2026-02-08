"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Asegúrate de tenerlo instalado: npm install jwt-decode

interface User {
  id: string;
  sub: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  role: "admin" | "participant" | null;
  isAuthenticated: boolean;
  user: User | null; // <--- Agregamos esto
}

interface AuthContextType extends AuthState {
  login: (token: string, role: "admin" | "participant") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ 
    token: null, 
    role: null, 
    isAuthenticated: false, 
    user: null 
  });
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("auth_token_admin");
    const participantToken = localStorage.getItem("auth_token_participant");
    const token = adminToken || participantToken;

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setAuth({
          token,
          role: adminToken ? "admin" : "participant",
          isAuthenticated: true,
          user: { id: decoded.sub_id || decoded.id, sub: decoded.sub || "Usuario", roles: decoded.roles || [] }
        });
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const login = (token: string, role: "admin" | "participant") => {
    localStorage.setItem(role === "admin" ? "auth_token_admin" : "auth_token_participant", token);
    const decoded: any = jwtDecode(token);
    
    setAuth({ 
      token, 
      role, 
      isAuthenticated: true,
      user: { id: decoded.sub_id || decoded.id, sub: decoded.sub, roles: decoded.roles || [] }
    });
    router.push(role === "admin" ? "/admin/tournaments" : "/dashboard");
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, isAuthenticated: false, user: null });
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