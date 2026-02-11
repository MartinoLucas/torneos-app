"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField, PasswordField } from "@/components/shared";
import { adminAccountService } from "@/features/admin/services/admin-account-service";
import { adminRegisterSchema } from "@/lib/validations/auth"; // Reutilizamos el esquema base
import { toast } from "sonner";
import { ShieldPlus, UserCircle, Mail, Lock } from "lucide-react";

interface CreateAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAdminModal({ open, onOpenChange, onSuccess }: CreateAdminModalProps) {
  
  const onSubmit = async (values: any) => {
    try {
      // Mapeamos los datos al DTO que espera /admin/accounts
      const payload = {
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email.trim(),
        password: values.password,
      };

      await adminAccountService.create(payload);
      toast.success("Nuevo administrador registrado");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      // Manejado por api-client
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white/90 backdrop-blur-xl border-white/20 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        
        {/* Header de Seguridad */}
        <div className="bg-zinc-950 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 text-zinc-500">
              <ShieldPlus size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Alta de <span className="text-zinc-500">Administrador</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs font-medium mt-1">
                Asigna privilegios de gestión a un nuevo usuario.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 pt-6">
          <FormTemplate
            title=""
            schema={adminRegisterSchema} // Puedes usar un esquema específico si no lleva documento
            defaultValues={{
              email: "",
              password: "",
            }}
            onSubmit={onSubmit}
            submitText="Crear Cuenta Administrativa"
          >
            {({ form }) => (
              <div className="space-y-5">
                <TextField
                control={form.control}
                name="email"
                label="Email"
                placeholder="admin@torneosapp.com"
                />

                <PasswordField
                control={form.control}
                name="password"
                label="Contraseña"
                />

                {/* Info de Seguridad */}
                <div className="bg-zinc-950/5 rounded-2xl p-4 border border-zinc-200/50 flex items-start gap-3">
                  <div className="bg-zinc-950 p-1.5 rounded-lg text-white mt-0.5">
                    <UserCircle size={14} />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-tight">
                    Esta cuenta tendrá acceso total al panel de torneos, gestión de inscriptos y configuración de precios. <span className="text-zinc-900 font-bold">Úselo con responsabilidad.</span>
                  </p>
                </div>
              </div>
            )}
          </FormTemplate>
        </div>
      </DialogContent>
    </Dialog>
  );
}