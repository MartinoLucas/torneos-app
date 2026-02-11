"use client";

import * as React from "react";
import { Competition, tournamentService } from "../services/tournament-service";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth-context";
import { InscriptionModal } from "./InscriptionModal";
import { inscriptionService } from "@/features/inscriptions/services/inscription-service";
import { toast } from "sonner";

interface CompetitionListProps {
  tournamentId: string | number;
  canRegister: boolean;
}

export function CompetitionList({ tournamentId, canRegister }: CompetitionListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, role } = useAuth();
  
  const [competitions, setCompetitions] = React.useState<Competition[]>([]);
  const [alreadyRegistered, setAlreadyRegistered] = React.useState<number[]>([]);
  const [tournamentInscriptionsCount, setTournamentInscriptionsCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [selectedComp, setSelectedComp] = React.useState<Competition | null>(null);

  // 1. Función Centralizada de Carga de Datos
  const loadData = React.useCallback(async () => {
    try {
      // Cargamos las competencias (cupos globales actualizados)
      const compData = await tournamentService.getCompetitions(tournamentId);
      const comps = compData.content || [];
      setCompetitions(comps);

      // Si el usuario está logueado, cargamos su estado personal
      if (isAuthenticated && user?.id && role != 'admin') {
        const insData = await inscriptionService.getMyInscriptions(user.id);
        const inscriptions = insData.content || [];
        
        // IDs de competencias donde el usuario ya está
        setAlreadyRegistered(inscriptions.map((ins: any) => ins.competencia.id));

        // Contador para el 50% OFF (inscripciones en este torneo)
        const count = inscriptions.filter((ins: any) => 
          String(ins.competencia.torneo.id) === String(tournamentId)
        ).length;
        setTournamentInscriptionsCount(count);
      }
    } catch (error) {
      toast.error("Error al cargar competencias");
      setCompetitions([]);
      setAlreadyRegistered([]);
      setTournamentInscriptionsCount(0);
    } finally {
      setLoading(false);
    }
  }, [tournamentId, isAuthenticated, user]);

  // Ejecución inicial
  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInscriptionClick = (comp: Competition) => {
    if (role === 'admin') return;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    setSelectedComp(comp);
  };

  const columns: ColumnDef<Competition>[] = [
    {
      id: "categoria",
      header: "Categoría",
      cell: (row) => (
        <div className="py-1">
          <div className="font-bold text-zinc-900 uppercase italic tracking-tighter leading-none">
            {row.nombre}
          </div>
          <div className="text-[10px] text-muted-foreground line-clamp-1 mt-1 font-medium">
            {row.descripcion}
          </div>
        </div>
      ),
    },
    {
      id: "cupo",
      header: "Disponibilidad",
      hideOnMobile: true,
      cell: (row) => {
        // El cupo real viene de la data global de la competencia
        const available = row.cupo - row.inscriptosActuales;
        const isLow = available <= 5;
        
        return (
          <div className="flex flex-col">
            <span className={`text-xs font-bold ${isLow ? 'text-red-500' : 'text-zinc-500'}`}>
              {available <= 0 ? "Cupo lleno" : `${available} lugares restantes`}
            </span>
            <div className="w-24 h-1 bg-zinc-100 rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                style={{ width: `${(row.inscriptosActuales / row.cupo) * 100}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "precio",
      header: "Precio",
      align: "right",
      cell: (row) => (
        <span className="font-mono font-bold text-zinc-900">
          ${row.precioBase.amount.toLocaleString()}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "",
      align: "right",
      cell: (row) => {
        const isFull = (row.cupo - row.inscriptosActuales) <= 0;
        const isRegistered = alreadyRegistered.includes(row.id);

        return (
          <Button 
            size="sm" 
            variant={isRegistered ? "secondary" : "default"}
            disabled={!canRegister || isRegistered || isFull}
            className="rounded-full px-6 font-bold uppercase text-[10px] tracking-widest"
            onClick={() => handleInscriptionClick(row)}
          >
            {isRegistered ? "Inscripto" : isFull ? "Agotado" : canRegister ? "Inscribirse" : "Cerrado"}
          </Button>
        );
      },
    },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Actualizando cupos...</p>
    </div>
  );

  if (competitions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/20 p-12 text-center shadow-2xl"
      >
        <div className="bg-zinc-950 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl">
          <Users className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-black uppercase italic text-zinc-900">Sin categorías</h3>
        <p className="text-zinc-500 mt-2 max-w-sm mx-auto text-sm font-medium">
          No hay competencias configuradas para este torneo aún.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mt-4">
      <DataTable 
        data={competitions} 
        columns={columns}
        searchPlaceholder="Filtrar categorías..."
        searchAccessor={(row) => row.nombre}
      />

      <InscriptionModal
        isOpen={!!selectedComp}
        competition={selectedComp}
        tournamentId={tournamentId}
        previousInscriptionsCount={tournamentInscriptionsCount}
        onClose={() => setSelectedComp(null)}
        onSuccess={loadData} // <--- loadData refresca TODO
      />
    </div>
  );
}