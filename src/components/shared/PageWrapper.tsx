"use client";

import { motion } from "framer-motion";

export function PageWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // La clave: overflow-hidden durante la animación o evitar que el height crezca
      className={`w-full min-h-screen flex flex-col overflow-x-hidden ${className || ""}`} 
    >
      {children}
    </motion.div>
  );
}