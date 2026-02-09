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

interface CompetitionListProps {
  tournamentId: string | number;
  canRegister: boolean;
}

export function CompetitionList({ tournamentId, canRegister }: CompetitionListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  
  const [competitions, setCompetitions] = React.useState<Competition[]>([]);
  const [alreadyRegistered, setAlreadyRegistered] = React.useState<number[]>([]);
  const [tournamentInscriptionsCount, setTournamentInscriptionsCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [selectedComp, setSelectedComp] = React.useState<Competition | null>(null);

  // Carga inicial de categorías
  React.useEffect(() => {
    tournamentService.getCompetitions(tournamentId)
      .then(data => setCompetitions(data.content || []))
      .catch(() => setCompetitions([]))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  // Función para refrescar el estado de inscripciones del usuario
  const fetchUserStatus = React.useCallback(() => {
    if (isAuthenticated && user?.id) {
      inscriptionService.getMyInscriptions(user.id)
        .then((data: any) => {          
          const inscriptions = data.content || [];
          const registeredCompIds = inscriptions.map((ins: any) => ins.competencia.id);
          setAlreadyRegistered(registeredCompIds);
          
          const count = inscriptions.filter((ins: any) => 
            String(ins.competencia.torneo.id) === String(tournamentId)
          ).length;
          setTournamentInscriptionsCount(count);
        })
        .catch(() => {
          setAlreadyRegistered([]);
          setTournamentInscriptionsCount(0);
        });
    }
  }, [isAuthenticated, user, tournamentId]);

  React.useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  const handleInscriptionClick = (comp: Competition) => {
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
          <div className="font-bold text-zinc-900 uppercase italic tracking-tighter leading-none">{row.nombre}</div>
          <div className="text-[10px] text-muted-foreground line-clamp-1 mt-1 font-medium">{row.descripcion}</div>
        </div>
      ),
    },
    {
      id: "cupo",
      header: "Disponibilidad",
      hideOnMobile: true,
      cell: (row) => {
        const remaining = row.cupo - row.inscriptosActuales;
        return (
          <span className={`text-xs font-bold ${remaining <= 5 ? 'text-red-500' : 'text-zinc-500'}`}>
            {remaining} lugares restantes
          </span>
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
      cell: (row) => (
        <Button 
          size="sm" 
          variant={alreadyRegistered.includes(row.id) ? "secondary" : "default"}
          disabled={!canRegister || alreadyRegistered.includes(row.id)}
          className="rounded-full px-6 font-bold uppercase text-[10px] tracking-widest"
          onClick={() => handleInscriptionClick(row)}
        >
          {alreadyRegistered.includes(row.id) ? "Inscripto" : canRegister ? "Inscribirse" : "Cerrado"}
        </Button>
      ),
    },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Sincronizando categorías...</p>
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
        <h3 className="text-xl font-black uppercase italic text-zinc-900">Listado de Categorías</h3>
        <p className="text-zinc-500 mt-2 max-w-sm mx-auto text-sm font-medium">
          Estamos terminando de configurar los cupos para este torneo.
        </p>
        <Button variant="outline" className="mt-6 rounded-xl font-bold uppercase text-xs" disabled>
          Próximamente
        </Button>
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
        onSuccess={fetchUserStatus}
      />
    </div>
  );
}