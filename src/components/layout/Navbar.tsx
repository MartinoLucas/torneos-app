"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trophy, User, LogOut, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/auth-context";
import { useRouter } from "next/navigation";
import { tournamentService, Tournament } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";

export function Navbar() {
  const { isAuthenticated, logout, role } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Tournament[]>([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // Debounce o búsqueda simple: Cuando el query cambia, buscamos
  React.useEffect(() => {
  const searchTorneos = async () => {
    // Si no hay texto, limpiamos
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Le pedimos al backend que filtre por nombre
      // El backend en Spring con Pageable suele aceptar filtros si los programas, 
      // o puedes usar un query param 'nombre'
      const data = await tournamentService.getPublished({ 
        search: query, // Cambia esto según como tu back reciba el filtro (ej: nombre: query)
        size: 20       // Traemos más para que el filtro sea efectivo
      });
      
      const allTournaments = data.content || [];
      
      // Filtramos por si las dudas y limitamos
      const filtered = allTournaments.filter(t => 
        t.nombre.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filtered);
    } catch (e) {
      toast.error("Error al buscar torneos");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const timer = setTimeout(searchTorneos, 300);
  return () => clearTimeout(timer);
}, [query]);

  const handleSelect = (id: number | string) => {
    setQuery("");
    setResults([]);
    setIsSearchFocused(false);
    router.push(`/tournaments/${id}`);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200/50 bg-zinc-100/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
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

        {/* Buscador Expandible con Resultados Live */}
        <div className="hidden md:flex flex-1 justify-center px-12 relative">
          <div className="relative max-w-md w-full">
            <motion.div animate={{ width: isSearchFocused || query ? "100%" : "80%" }} className="relative mx-auto">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors z-10 ${isSearchFocused ? 'text-zinc-950' : 'text-zinc-400'}`} />
              <Input
                placeholder="Buscar torneos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-zinc-200/50 border-transparent focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all duration-300 rounded-2xl placeholder:text-zinc-500 text-zinc-900 h-10"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay para permitir clic en resultados
              />
              {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-zinc-400" />}
            </motion.div>

            {/* Dropdown de Resultados (Glassmorphism) */}
            <AnimatePresence>
              {(isSearchFocused && (results.length > 0 || loading)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl p-4 overflow-hidden z-100"
                >
                  {/* Contenedor con Scroll sutil si hay muchos */}
                  <div className="max-h-75 overflow-y-auto pr-1 custom-scrollbar space-y-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
                      </div>
                    ) : (
                      results.map((torneo) => (
                        <button
                          key={torneo.id}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Evita que el onBlur del input cierre esto antes del click
                            handleSelect(torneo.id);
                          }}
                          className="w-full flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-zinc-950 hover:text-white transition-all group text-left"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase italic tracking-tight leading-none group-hover:text-zinc-400 transition-colors">
                              {torneo.nombre}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 group-hover:text-zinc-400 font-bold uppercase mt-1.5">
                              <Calendar size={10} className="text-zinc-400" /> {torneo.fechaInicio}
                            </div>
                          </div>
                          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-zinc-400" />
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Acciones */}
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