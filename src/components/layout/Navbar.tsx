"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Trophy, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isAuthenticated, logout, role } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const router = useRouter();

  return (
    // Cambiamos bg-background por bg-zinc-100/70 para ese tono grisáceo translúcido
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-zinc-100/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo: Ahora con el estilo de la App (Black, Italic, Uppercase) */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="bg-zinc-950 p-2 rounded-xl text-white shadow-lg shadow-zinc-950/20"
          >
            <Trophy size={18} />
          </motion.div>
          <span className="text-xl font-black italic uppercase tracking-tighter text-zinc-900">
            Torneos<span className="text-zinc-500">App</span>
          </span>
        </Link>

        {/* Buscador Expandible: Ajustado a Zinc */}
        <div className="hidden md:flex flex-1 justify-center px-12">
          <motion.div 
            animate={{ width: isSearchFocused ? "100%" : "80%" }}
            className="relative max-w-md w-full"
          >
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isSearchFocused ? 'text-zinc-950' : 'text-zinc-400'}`} />
            <Input
              placeholder="Buscar torneos..."
              className="pl-10 bg-zinc-200/50 border-transparent focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all duration-300 rounded-2xl placeholder:text-zinc-500 text-zinc-900"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </motion.div>
        </div>

        {/* Acciones: Con botones más redondeados para el estilo Glass */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push(role === "admin" ? "/admin/tournaments" : "/dashboard")} 
                className="rounded-2xl hover:bg-zinc-200/50 text-zinc-600 hover:text-zinc-950"
              >
                <User size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout} 
                className="hidden sm:flex items-center gap-2 border-zinc-200 bg-white/50 rounded-2xl font-bold text-zinc-700 hover:bg-white"
              >
                <LogOut size={14} /> Salir
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold text-zinc-600 hover:text-zinc-950">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-zinc-950 text-white rounded-2xl px-6 font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-950/20">
                  Unirse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}