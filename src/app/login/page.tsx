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
    // intentamos primero login con admin, si no anda hacemos participant
    try {
      const response = await authService.adminLogin(values);
      login(response.token, "admin");
      toast.success("¡Bienvenido de nuevo!");
    } catch (error: any) {
      try {
        const response = await authService.participantLogin(values);
        login(response.token, "participant");
        toast.success("¡Bienvenido de nuevo!");
      } catch (error: any) {
        toast.error(error?.title || "Error al iniciar sesión");
      }
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
            {({ form, isPending }) => (
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
                <p className="text-center text-sm text-muted-foreground pt-2">
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