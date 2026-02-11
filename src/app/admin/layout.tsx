"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorizing, setIsAuthorizing] = React.useState(true);
  const [error, setError] = React.useState<{ title: string; description: string } | null>(null);
  const [retry, setRetry] = React.useState<{retryFunction?: () => void; retryMessage?: string} | null>(null);

  React.useEffect(() => {
    // 2. Si hay usuario, verificamos el rol
    if (user) {
      if (!user.roles.includes("ROLE_ADMIN")) {
        setError({
          title: "Acceso Restringido",
          description: "Esta zona es exclusiva para personal administrativo. Tu acceso ha sido denegado."
        });
        setRetry({
          retryFunction: () => router.push("/dashboard"),
          retryMessage: "Volver al Panel de Atleta"
        });
      }
      setIsAuthorizing(false);
    }
  }, [user, router]);

  return (
    <PageWrapper 
      isLoading={isAuthorizing} 
      loadingMessage="Verificando Credenciales de Admin"
      error={error}
        retryFunction={retry?.retryFunction}
        retryMessage={retry?.retryMessage}
    >
      {/* Si no hay error y ya se autorizó, renderizamos la página hija */}
      {!isAuthorizing && !error && children}
    </PageWrapper>
  );
}