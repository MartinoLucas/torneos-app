"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldAlert, Trophy } from "lucide-react";
import { Button } from "../ui/button";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  error?: {
    title: string;
    description: string;
  } | null;
  retryFunction?: () => void;
  retryMessage?: string;
}

export function PageWrapper({ 
  children, 
  className, 
  isLoading, 
  loadingMessage = "Sincronizando...",
  error,
  retryFunction,
  retryMessage
}: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full min-h-screen flex flex-col overflow-x-hidden ${className || ""}`} 
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <div className="bg-zinc-950 p-5 rounded-[2rem] text-white relative z-10 shadow-2xl">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
            <p className="mt-6 text-xs font-black uppercase italic tracking-[0.3em] text-zinc-400 animate-pulse">
              {loadingMessage}
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="bg-red-500/10 p-5 rounded-[2rem] text-red-600 mb-6 border border-red-500/20">
                <ShieldAlert size={40} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
              {error.title}
            </h2>
            <p className="mt-2 text-zinc-500 font-medium max-w-xs uppercase text-[10px] tracking-widest">
              {error.description}
            </p>
            <Button variant="outline" size="sm" className="mt-6" onClick={retryFunction || (() => window.location.reload())}>
              {retryMessage || "Reintentar"}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="content" className="flex-1 flex flex-col">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}