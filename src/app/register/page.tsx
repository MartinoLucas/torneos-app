"use client";

import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField, PasswordField, SelectField } from "@/components/shared";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { authService } from "@/features/auth/services/auth-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authService.register(values);
      toast.success("Cuenta creada con éxito. Ahora podés iniciar sesión.");
      router.push("/login");
    } catch (error: any) {
      // Usamos el 'title' o 'detail' que viene de tu ApiError de Java
      toast.error(error?.title || "Error al registrarse");
    }
  };

  return (
    <PageWrapper>
      <div className="flex min-h-screen items-center justify-center p-6 bg-zinc-50">
        <div className="w-full max-w-2xl">
          <FormTemplate
            title="Crear Cuenta"
            description="Completá tus datos para participar en los torneos."
            schema={registerSchema}
            defaultValues={{
              email: "",
              password: "",
              firstName: "",
              lastName: "",
              documentType: "DNI",
              documentNumber: "",
            }}
            onSubmit={onSubmit}
            submitText="Registrarse"
          >
            {({ form }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  control={form.control}
                  name="firstName"
                  label="Nombre"
                  placeholder="Juan"
                />
                <TextField
                  control={form.control}
                  name="lastName"
                  label="Apellido"
                  placeholder="Pérez"
                />
                <SelectField
                    control={form.control}
                    name="documentType"
                    label="Tipo de Doc."
                    options={[
                        { label: "DNI", value: "DNI" },
                        { label: "Libreta de Enrolamiento", value: "LE" },
                        { label: "Libreta Cívica", value: "LC" },
                        { label: "Pasaporte", value: "PASAPORTE" },
                    ]}
                />
                <TextField
                  control={form.control}
                  name="documentNumber"
                  label="Número de Doc."
                  placeholder="12345678"
                />
                <div className="md:col-span-2">
                  <TextField
                    control={form.control}
                    name="email"
                    label="Correo Electrónico"
                    placeholder="juan@correo.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <PasswordField
                    control={form.control}
                    name="password"
                    label="Contraseña"
                  />
                </div>
                <p className="md:col-span-2 text-center text-sm text-muted-foreground mt-2">
                  ¿Ya tenés cuenta?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Iniciá sesión acá
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