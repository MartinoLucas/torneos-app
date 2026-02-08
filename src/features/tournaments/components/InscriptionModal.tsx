"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Competition } from "../services/tournament-service";
import { inscriptionService } from "@/features/inscriptions/services/inscription-service";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface InscriptionModalProps {
  competition: Competition | null;
  tournamentId: string | number;
  isOpen: boolean;
  onClose: () => void;
}

export function InscriptionModal({ competition, tournamentId, isOpen, onClose }: InscriptionModalProps) {
  const [isPending, setIsPending] = React.useState(false);

  if (!competition) return null;

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await inscriptionService.create(tournamentId, competition.id);
      toast.success("¡Inscripción exitosa!", {
        description: `Ya estás registrado en ${competition.nombre}`
      });
      onClose();
    } catch (error: any) {
      // El api-client ya dispara el toast de error, aquí solo manejamos el estado
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirmar Inscripción
          </DialogTitle>
          <DialogDescription>
            Estás por inscribirte a la categoría <strong>{competition.nombre}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Precio base:</span>
            <span className="font-medium">${competition.precioBase.amount}</span>
          </div>
          
          {/* Aquí el backend debería devolver si aplica descuento, 
              por ahora mostramos el precio final del DTO */}
          <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold text-lg">
            <span>Total a pagar:</span>
            <span className="text-primary">${competition.precioBase.amount}</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirmar e Inscribirme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}