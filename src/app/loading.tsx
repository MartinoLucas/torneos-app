"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-100">
      {/* Decoración de fondo sutil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-zinc-300/50 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animado con efecto Glassmorphism */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.9, 1.1, 1],
            opacity: 1,
            rotate: [0, -5, 0] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="relative"
        >
          {/* Brillo exterior */}
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          
          {/* Contenedor del Icono */}
          <div className="relative bg-zinc-950 p-6 rounded-[2.5rem] text-white shadow-2xl border border-white/10">
            <Trophy size={48} strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Texto de Carga con estilo de marca */}
        <div className="mt-12 text-center space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
            Torneos<span className="text-zinc-400">App</span>
          </h2>
          
          <div className="flex flex-col items-center gap-4">
            {/* Barra de progreso infinita */}
            <div className="w-32 h-1 bg-zinc-200 rounded-full overflow-hidden relative">
              <motion.div 
                animate={{ 
                  x: [-128, 128] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute inset-0 w-full h-full bg-primary"
              />
            </div>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">
              Sincronizando Sistema
            </p>
          </div>
        </div>
      </div>

      {/* Marca de agua sutil en el footer */}
      <div className="absolute bottom-10 text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">
        Legacy Edition — 2026
      </div>
    </div>
  );
}