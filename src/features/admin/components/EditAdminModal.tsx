"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { PasswordField, TextField } from "@/components/shared";
import { adminAccountService } from "@/features/admin/services/admin-account-service";
import { toast } from "sonner";
import { Edit3, Mail, ShieldCheck } from "lucide-react";
import { updateAdminSchema } from "@/lib/validations/auth";


interface EditAdminModalProps {
  admin: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditAdminModal({ admin, open, onOpenChange, onSuccess }: EditAdminModalProps) {
  if (!admin) return null;

  const onSubmit = async (values: any) => {
    try {
        // Solo enviamos la contraseña si tiene contenido
        const hasPassword = values.password && values.password.trim().length > 0;
        
        const payload = {
        email: values.email,
        // Si no hay password, no incluimos la propiedad en el objeto
        ...(hasPassword && { password: values.password }),
        };

        await adminAccountService.update(admin.id, payload);
        toast.success("Perfil de administrador actualizado");
        onSuccess();
        onOpenChange(false);
    } catch (error) {
        // El interceptor maneja el error
    }
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white/90 backdrop-blur-xl border-white/20 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        
        <div className="bg-zinc-950 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 text-zinc-500">
              <Edit3 size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Editar <span className="text-zinc-500">Perfil</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs font-medium mt-1">
                ID: #{admin.id} • Rol: Administrador
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 pt-6">
          <FormTemplate
            title=""
            schema={updateAdminSchema}
            defaultValues={{
                email: admin.email,
                password: "",
                confirmPassword: "",
            }}
            onSubmit={onSubmit}
            submitText="Guardar Cambios"
          >
            {({ form }) => (
              <div className="space-y-5">
                
                <TextField control={form.control} name="email" label="Email de Acceso" disabled />
                <PasswordField control={form.control} name="password" label="Nueva Contraseña" />
                <PasswordField control={form.control} name="confirmPassword" label="Confirmar Nueva Contraseña" />

                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 flex items-start gap-3">
                  <ShieldCheck size={16} className="text-zinc-400 mt-0.5" />
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase">
                    Los cambios de email afectarán las credenciales de inicio de sesión del usuario.
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