"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField } from "@/components/shared/fields/TextField";
import { competenciaSchema, CompetenciaInput } from "@/lib/validations/competition";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";
import { Layers, DollarSign, Users } from "lucide-react";

interface CreateCompetenciaModalProps {
  tournamentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCompetenciaModal({ tournamentId, open, onOpenChange, onSuccess }: CreateCompetenciaModalProps) {
  
  const onSubmit = async (values: CompetenciaInput) => {
    try {
      const payload = {
        nombre: values.nombre,
        cupo: values.cupo,
        precioBase: {
          amount: values.precio,
          currency: "ARS"
        }
      };

      await tournamentService.createCompetition(tournamentId, payload);
      toast.success("Competencia creada con éxito");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Aplicamos el efecto vidrio y bordes redondeados al contenido del Dialog */}
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-xl border-white/20 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        
        {/* Header con estilo de marca */}
        <div className="bg-zinc-950 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <Layers size={24} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Nueva <span className="text-zinc-400">Categoría</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs font-medium mt-1">
                Define los parámetros de la competencia.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 pt-6">
          <FormTemplate
            title=""
            schema={competenciaSchema}
            defaultValues={{
              nombre: "",
              precio: 0,
              cupo: 10,
            }}
            onSubmit={onSubmit}
            submitText="Crear Competencia"
          >
            {({ form }) => (
              <div className="space-y-6">
                <TextField
                  control={form.control}
                  name="nombre"
                  label="Nombre de la Categoría"
                  placeholder="Ej: Principiantes +18"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <TextField
                      control={form.control}
                      name="precio"
                      label="Precio Inscripción"
                      type="number"
                    />
                    <div className="absolute right-3 top-9.5 text-zinc-400">
                        <DollarSign size={14} />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <TextField
                      control={form.control}
                      name="cupo"
                      label="Cupo Máximo"
                      type="number"
                    />
                    <div className="absolute right-3 top-9.5 text-zinc-400">
                        <Users size={14} />
                    </div>
                  </div>
                </div>

                {/* Nota informativa sutil */}
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Los precios se guardan en moneda ARS por defecto.
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