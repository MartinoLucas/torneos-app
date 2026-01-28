"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Logueamos el error para debug
    console.error("Critical Runtime Error:", error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">¡Ups! Algo salió mal</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          La aplicación experimentó un error inesperado. Hemos sido notificados y estamos trabajando en ello.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Reintentar
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/"} className="gap-2">
            <Home className="h-4 w-4" /> Ir al Inicio
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-8 p-4 bg-zinc-100 rounded text-left text-xs overflow-auto max-w-full">
            {error.message}
          </pre>
        )}
      </div>
    </PageWrapper>
  );
}