import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FramerProvider } from "@/components/providers/framer-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/context/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Torneos | Pro",
  description: "Gestión avanzada de competencias y participantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <AuthProvider>
          <FramerProvider>
            {children}
            {/* Toaster de Sonner para notificaciones globales */}
            <Toaster position="top-right" richColors closeButton />
          </FramerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}