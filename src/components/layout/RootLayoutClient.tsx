"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { FramerProvider } from "@/components/providers/framer-provider";
import { Toaster } from "@/components/ui/sonner";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const authRoutes = ["/login", "/register"];
  const isAuthPage = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      <FramerProvider>
        {/* Navbar condicional */}
        {!isAuthPage && <Navbar />}
        
        {/* Si es página de auth, no aplicamos el pt-16 para que el centrado sea perfecto */}
        <main className={!isAuthPage ? "pt-16 min-h-screen" : "min-h-screen"}>
          {children}
        </main>
        
        <Toaster position="top-right" richColors closeButton />
      </FramerProvider>
    </AuthProvider>
  );
}