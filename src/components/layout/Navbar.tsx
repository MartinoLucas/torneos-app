"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Trophy, User, LogOut, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo con Animación sutil */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="bg-primary p-1.5 rounded-lg text-primary-foreground"
          >
            <Trophy size={18} />
          </motion.div>
          <span className="tracking-tight">Torneos<span className="text-muted-foreground font-medium">App</span></span>
        </Link>

        {/* Buscador Expandible */}
        <div className="hidden md:flex flex-1 justify-center px-12">
          <motion.div 
            animate={{ width: isSearchFocused ? "100%" : "80%" }}
            className="relative max-w-md w-full"
          >
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
            <Input
              placeholder="Buscar torneos, competencias..."
              className="pl-9 bg-muted/40 border-transparent focus:bg-background transition-all duration-300 rounded-full"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </motion.div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="rounded-full cur">
                <User size={20} />
              </Button>
              <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex items-center gap-2">
                <LogOut size={14} /> Salir
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-5">Unirse</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}