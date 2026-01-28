"use client";

import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField, PasswordField } from "@/components/shared";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { authService } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();

  const onSubmit = async (values: LoginInput) => {
    try {
      const response = await authService.participantLogin(values);
      // El backend devuelve ApiResponse<AuthResponse>, el interceptor ya nos dio el body
      login(response.token, "participant");
      toast.success("¡Bienvenido de nuevo!");
    } catch (error: any) {
      toast.error(error?.title || "Error al iniciar sesión");
    }
  };

  return (
    <PageWrapper>
      <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50">
        <div className="w-full max-w-md">
          <FormTemplate
            title="Iniciar Sesión"
            description="Ingresá tus credenciales para acceder a los torneos."
            schema={loginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            submitText="Entrar"
          >
            {({ form }) => (
              <div className="space-y-4">
                <TextField
                  control={form.control}
                  name="email"
                  label="Correo Electrónico"
                  placeholder="ejemplo@correo.com"
                />
                <PasswordField
                  control={form.control}
                  name="password"
                  label="Contraseña"
                />
                <p className="text-center text-sm text-muted-foreground">
                  ¿No tenés cuenta?{" "}
                  <Link href="/register" className="text-primary font-medium hover:underline">
                    Registrate acá
                  </Link>
                </p>
              </div>
            )}
          </FormTemplate>
        </div>
      </div>
    </PageWrapper>
  );
}