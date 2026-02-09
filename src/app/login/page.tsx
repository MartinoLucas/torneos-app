"use client";

import { PageWrapper } from "@/components/shared/PageWrapper";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField, PasswordField } from "@/components/shared";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { authService } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/context/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  const onSubmit = async (values: LoginInput) => {
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
    <PageWrapper className="bg-zinc-100">
      {/* items-center y justify-center aquí centrarán la Card 
          en el espacio "útil" de la pantalla (Viewport - Navbar)
      */}
      <div className="flex-1 flex items-center justify-center p-6 relative">

        {/* Botón flotante para volver */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors font-medium text-sm z-20">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        
        {/* Decoración de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-200/60 rounded-full blur-3xl -z-10" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/20">
            
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="bg-zinc-950 p-3 rounded-2xl text-white mb-4 shadow-xl">
                <Trophy size={28} />
              </div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 leading-none">
                Bienvenido
                <span className="text-zinc-400 block text-lg not-italic lowercase font-medium tracking-normal mt-1">
                  Inicia sesión en TorneosApp
                </span>
              </h1>
            </div>

            <FormTemplate
              title=""
              description=""
              schema={loginSchema}
              defaultValues={{ email: "", password: "" }}
              onSubmit={onSubmit}
              submitText="Entrar a mi cuenta"
            >
              {({ form }) => (
                <div className="space-y-5">
                  <TextField
                    control={form.control}
                    name="email"
                    label="Correo Electrónico"
                    placeholder="tu@email.com"
                  />
                  <PasswordField
                    control={form.control}
                    name="password"
                    label="Contraseña"
                  />
                  
                  <div className="pt-2">
                    <p className="text-center text-sm text-zinc-500 font-medium">
                      ¿Nuevo por acá?{" "}
                      <Link href="/register" className="text-zinc-950 font-bold hover:underline inline-flex items-center gap-1 group">
                        Crear cuenta <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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