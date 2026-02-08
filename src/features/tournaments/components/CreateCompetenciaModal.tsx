"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormTemplate } from "@/components/shared/FormTemplate";
import { TextField } from "@/components/shared/fields/TextField";
import { competenciaSchema, CompetenciaInput } from "@/lib/validations/competition";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { toast } from "sonner";

interface CreateCompetenciaModalProps {
  tournamentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCompetenciaModal({ tournamentId, open, onOpenChange, onSuccess }: CreateCompetenciaModalProps) {
  
  const onSubmit = async (values: CompetenciaInput) => {
    try {
      // Mapeamos manualmente 'precio' a 'precioBase' con su estructura de objeto
      const payload = {
        nombre: values.nombre,
        cupo: values.cupo,
        precioBase: {
          amount: values.precio, // Usamos 'values.precio' que es lo que TS conoce
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Nueva Competencia</DialogTitle>
          <DialogDescription>
            Agrega una nueva categoría o competencia a este torneo.
          </DialogDescription>
        </DialogHeader>

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
            <div className="space-y-4 py-2">
              <TextField
                control={form.control}
                name="nombre"
                label="Nombre de la Competencia"
                placeholder="Ej: Categoría Principiantes"
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  control={form.control}
                  name="precio"
                  label="Precio ($)"
                  type="number"
                />
                <TextField
                  control={form.control}
                  name="cupo"
                  label="Cupo Máximo"
                  type="number"
                />
              </div>
            </div>
          )}
        </FormTemplate>
      </DialogContent>
    </Dialog>
  );
}