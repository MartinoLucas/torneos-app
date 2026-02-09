"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField, PasswordField, SelectField } from "@/components/shared";
import { authService } from "@/features/auth/services/auth-service";
import { registerSchema, RegisterInput } from "@/lib/validations/auth"; // Importación corregida
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const tipoDocOptions = [
    { label: "DNI", value: "DNI" },
    { label: "LE", value: "LE" },
    { label: "LC", value: "LC" },
    { label: "Pasaporte", value: "PASAPORTE" },
  ];

  const onSubmit = async (values: RegisterInput) => {
    try {
      // Mapeamos el esquema plano al DTO que espera el backend
      const payload = {
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email.trim(),
        password: values.password,
        documento: {
          tipo: values.documentoTipo as "DNI" | "LE" | "LC" | "PASAPORTE",
          numero: values.documentoNumero.trim()
        }
      };

      await authService.register(payload);
      toast.success("¡Cuenta creada exitosamente!");
      
      const nextUrl = redirectPath 
        ? `/login?redirect=${encodeURIComponent(redirectPath)}` 
        : "/login";
        
      router.push(nextUrl);
    } catch (error) {
      // Manejado por interceptor
    }
  };

  return (
    <PageWrapper className="bg-zinc-100">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors font-medium text-sm z-20">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-zinc-200/50 rounded-full blur-3xl -z-10" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg relative z-10"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/20">
            
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="bg-zinc-950 p-3 rounded-2xl text-white mb-4 shadow-xl">
                <UserPlus size={28} />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
                Crea tu cuenta
                <span className="text-zinc-400 block text-lg not-italic lowercase font-medium tracking-normal mt-1">
                  Únete a la comunidad de TorneosApp
                </span>
              </h1>
            </div>

            <FormTemplate
              title=""
              description=""
              schema={registerSchema}
              defaultValues={{ 
                nombre: "", 
                apellido: "", 
                email: "", 
                password: "", 
                documentoTipo: "DNI", 
                documentoNumero: "" 
              }}
              onSubmit={onSubmit}
              submitText="Registrarme ahora"
            >
              {({ form }) => (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      control={form.control}
                      name="nombre"
                      label="Nombre"
                      placeholder="Juan"
                    />
                    <TextField
                      control={form.control}
                      name="apellido"
                      label="Apellido"
                      placeholder="Pérez"
                    />
                  </div>

                  <TextField
                    control={form.control}
                    name="email"
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <SelectField
                        control={form.control}
                        name="documentoTipo"
                        label="Tipo"
                        options={tipoDocOptions}
                      />
                    </div>
                    <div className="col-span-2">
                      <TextField
                        control={form.control}
                        name="documentoNumero"
                        label="Número de Documento"
                        placeholder="12345678"
                      />
                    </div>
                  </div>

                  <PasswordField
                    control={form.control}
                    name="password"
                    label="Contraseña"
                  />
                  
                  <div className="pt-2 border-t border-zinc-100">
                    <p className="text-center text-sm text-zinc-500 font-medium">
                      ¿Ya tienes una cuenta?{" "}
                      <Link 
                        href={redirectPath ? `/login?redirect=${redirectPath}` : "/login"} 
                        className="text-zinc-950 font-bold hover:underline"
                      >
                        Inicia sesión acá
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </FormTemplate>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}