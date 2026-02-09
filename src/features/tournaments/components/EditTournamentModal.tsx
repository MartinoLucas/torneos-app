"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField } from "@/components/shared/fields/TextField";
import { tournamentSchema, TournamentInput } from "@/lib/validations/tournament";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Edit3, Calendar, Info, Lock } from "lucide-react";

interface EditTournamentModalProps {
  tournament: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTournamentModal({ tournament, open, onOpenChange, onSuccess }: EditTournamentModalProps) {
  const isEditable = tournament.estado === "BORRADOR";

  const onSubmit = async (values: TournamentInput) => {
    if (!isEditable) {
      onOpenChange(false);
      return;
    }
    try {
      await tournamentService.updateTournament(tournament.id, values);
      toast.success("Torneo actualizado correctamente");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white/90 backdrop-blur-xl border-white/20 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        
        {/* Header con estilo de marca y lógica de estado */}
        <div className={`p-8 text-white relative overflow-hidden ${isEditable ? 'bg-zinc-950' : 'bg-zinc-800'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                {isEditable ? <Edit3 size={24} className="text-white" /> : <Lock size={24} className="text-zinc-400" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                  {isEditable ? 'Editar' : 'Info del'} <span className="text-zinc-400">Torneo</span>
                </DialogTitle>
                <DialogDescription className="text-zinc-400 text-xs font-medium mt-1">
                  ID: #{tournament.id} • Estado: {tournament.estado}
                </DialogDescription>
              </div>
            </div>
            {!isEditable && (
              <Badge variant="outline" className="border-zinc-600 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Solo Lectura
              </Badge>
            )}
          </div>
        </div>

        <div className="p-8 pt-6">
          <FormTemplate
            title=""
            schema={tournamentSchema}
            defaultValues={{
              nombre: tournament.nombre,
              descripcion: tournament.descripcion || "",
              fechaInicio: tournament.fechaInicio,
              fechaFin: tournament.fechaFin,
              estado: tournament.estado,
            }}
            onSubmit={onSubmit}
            submitText={isEditable ? "Guardar Cambios" : "Cerrar Ventana"}
          >
            {({ form }) => (
              <div className="space-y-6">
                <TextField 
                  control={form.control} 
                  name="nombre" 
                  label="Nombre del Torneo" 
                  disabled={!isEditable} 
                  placeholder="Ej: Open Verano"
                />
                
                <TextField 
                  control={form.control} 
                  name="descripcion" 
                  label="Descripción General" 
                  disabled={!isEditable} 
                  placeholder="Detalles del evento..."
                />
                
                <div className="pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cronograma</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <TextField 
                      control={form.control} 
                      name="fechaInicio" 
                      label="Inicio" 
                      type="date" 
                      disabled={!isEditable} 
                    />
                    <TextField 
                      control={form.control} 
                      name="fechaFin" 
                      label="Fin" 
                      type="date" 
                      disabled={!isEditable} 
                    />
                  </div>
                </div>

                {/* Aviso de bloqueo si no es editable */}
                {!isEditable && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                    <Info size={18} className="text-amber-600 mt-0.5" />
                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                      Este torneo ya no está en <strong className="uppercase">Borrador</strong>. 
                      Para realizar cambios estructurales, contacta con soporte técnico o revisa el estado de publicación.
                    </p>
                  </div>
                )}
              </div>
            )}
          </FormTemplate>
        </div>
      </DialogContent>
    </Dialog>
  );
}