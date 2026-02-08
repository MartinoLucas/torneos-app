"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField } from "@/components/shared/fields/TextField";
import { tournamentSchema, TournamentInput } from "@/lib/validations/tournament";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface EditTournamentModalProps {
  tournament: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTournamentModal({ tournament, open, onOpenChange, onSuccess }: EditTournamentModalProps) {
  const isEditable = tournament.estado === "BORRADOR";

  const onSubmit = async (values: TournamentInput) => {
    if (!isEditable) return;
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {isEditable ? "Editar Torneo" : "Detalles del Torneo"}
            {!isEditable && <Badge variant="secondary">Solo Lectura</Badge>}
          </DialogTitle>
          <DialogDescription>
            {isEditable 
              ? "Modifica la información mientras el torneo esté en borrador." 
              : `Este torneo está ${tournament.estado} y no permite modificaciones.`}
          </DialogDescription>
        </DialogHeader>

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
          submitText={isEditable ? "Guardar Cambios" : "Entendido"}
        >
          {({ form }) => (
            <div className="space-y-4 py-2">
              <TextField control={form.control} name="nombre" label="Nombre" disabled={!isEditable} />
              <TextField control={form.control} name="descripcion" label="Descripción" disabled={!isEditable} />
              <div className="grid grid-cols-2 gap-4">
                <TextField control={form.control} name="fechaInicio" label="Inicio" type="date" disabled={!isEditable} />
                <TextField control={form.control} name="fechaFin" label="Fin" type="date" disabled={!isEditable} />
              </div>
            </div>
          )}
        </FormTemplate>
      </DialogContent>
    </Dialog>
  );
}