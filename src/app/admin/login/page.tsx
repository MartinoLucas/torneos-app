"use client";

import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField, PasswordField } from "@/components/shared";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { authService } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const { login } = useAuth();

  const onSubmit = async (values: LoginInput) => {
    try {
      const response = await authService.adminLogin(values);
      login(response.token, "admin");
      toast.success("Acceso administrativo concedido");
    } catch (error: any) {
      toast.error(error?.title || "Error de acceso administrativo");
    }
  };

  return (
    <PageWrapper>
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-900">
        <div className="w-full max-w-md">
          <FormTemplate
            title="Panel de Administración"
            description="Ingreso exclusivo para personal autorizado."
            schema={loginSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            submitText="Entrar al Panel"
          >
            {({ form }) => (
              <div className="space-y-4">
                <TextField
                  control={form.control}
                  name="email"
                  label="Email Admin"
                />
                <PasswordField
                  control={form.control}
                  name="password"
                  label="Contraseña"
                />
              </div>
            )}
          </FormTemplate>
        </div>
      </div>
    </PageWrapper>
  );
}