import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        {/* Delegamos toda la lógica de cliente a este componente */}
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}