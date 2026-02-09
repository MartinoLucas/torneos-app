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
import { Loader2, CheckCircle2, Ticket, Wallet, Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/context/auth-context";
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";

interface InscriptionModalProps {
  competition: Competition | null;
  tournamentId: string | number;
  isOpen: boolean;
  previousInscriptionsCount: number;
  onClose: () => void;
}

export function InscriptionModal({ competition, tournamentId, isOpen, previousInscriptionsCount, onClose }: InscriptionModalProps) {
  const [isPending, setIsPending] = React.useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (!competition) return null;

  // Lógica de precio
  const basePrice = competition.precioBase.amount;
  const hasDiscount = previousInscriptionsCount > 0;
  const finalPrice = hasDiscount ? basePrice * 0.5 : basePrice;

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      if (!user?.id) return;
      await inscriptionService.create(tournamentId, competition.id, user?.id);
      toast.success("¡Inscripción exitosa!", {
        description: `Ya estás registrado en ${competition.nombre}`
      });
      onClose();
      router.refresh();
    } catch (error: any) {
      // Manejado por api-client
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-xl border-white/20 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        
        {/* Header con Estética de Marca */}
        <div className="bg-zinc-950 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <Ticket size={24} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Confirmar <span className="text-zinc-400">Inscripción</span>
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs font-medium mt-1">
                Estás a un paso de la competencia.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Detalles de la Categoría */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Categoría seleccionada</span>
            <h3 className="text-xl font-black uppercase italic text-zinc-900 tracking-tight">
              {competition.nombre}
            </h3>
          </div>

          {/* Card de Precios con Descuento Dinámico */}
          <div className="bg-zinc-950/5 rounded-[2rem] p-6 border border-zinc-200/50 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="flex items-center gap-2 text-zinc-500">
                <Wallet size={14} />
                <span>Costo de inscripción</span>
              </div>
              <span className={`font-mono ${hasDiscount ? 'text-zinc-400 line-through text-xs' : 'text-zinc-900'}`}>
                ${basePrice.toLocaleString()}
              </span>
            </div>

            {hasDiscount && (
              <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">50% OFF</div>
                  <span>Descuento por 2da inscripción</span>
                </div>
                <span className="font-mono">-${(basePrice * 0.5).toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center border-t border-zinc-200 pt-4">
              <span className="text-sm font-black uppercase italic text-zinc-900">Total a pagar</span>
              <span className="text-2xl font-black text-zinc-900 font-mono">
                ${finalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Aviso de Proceso */}
          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
              Al confirmar, tu lugar quedará reservado. Podrás gestionar el estado de tu pago desde tu panel de usuario.
            </p>
          </div>
        </div>

        {/* Footer con Botones Estilizados */}
        <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isPending}
            className="flex-1 rounded-xl font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 uppercase text-xs tracking-widest"
          >
            Mejor no
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isPending} 
            className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl font-bold h-12 shadow-lg shadow-zinc-950/20 gap-2 uppercase text-xs tracking-widest transition-all active:scale-95"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {isPending ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}