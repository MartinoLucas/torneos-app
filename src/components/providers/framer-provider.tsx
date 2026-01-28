"use client";

import { MotionConfig } from "framer-motion";

export function FramerProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig 
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] // Ease-out suave (estilo Premium)
      }}
    >
      {children}
    </MotionConfig>
  );
}