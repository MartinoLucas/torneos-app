"use client";

import * as React from "react";
import { Competition, tournamentService } from "../services/tournament-service";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth-context";
import { InscriptionModal } from "./InscriptionModal";

interface CompetitionListProps {
  tournamentId: string | number;
  canRegister: boolean;
}

export function CompetitionList({ tournamentId, canRegister }: CompetitionListProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [competitions, setCompetitions] = React.useState<Competition[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Estado para el modal
  const [selectedComp, setSelectedComp] = React.useState<Competition | null>(null);

  React.useEffect(() => {
    tournamentService.getCompetitions(tournamentId)
      .then(data => setCompetitions(data.content || []))
      .catch(() => setCompetitions([]))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const handleInscriptionClick = (comp: Competition) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  };

  // Definición de columnas para nuestra DataTable genérica
  const columns: ColumnDef<Competition>[] = [
    {
      id: "categoria",
      header: "Categoría",
      cell: (row) => (
        <div className="py-1">
          <div className="font-bold text-zinc-900">{row.nombre}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">{row.descripcion}</div>
        </div>
      ),
    },
    {
      id: "cupo",
      header: "Cupo",
      hideOnMobile: true,
      cell: (row) => <span className="text-zinc-600">{row.cupo} lugares</span>,
    },
    {
      id: "precio",
      header: "Precio",
      align: "right",
      cell: (row) => (
        <span className="font-mono font-bold text-zinc-900">
          ${row.precioBase.amount}
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
          variant={canRegister ? "default" : "secondary"}
          disabled={!canRegister}
          className="rounded-full px-6"
          onClick={() => handleInscriptionClick(row)}
        >
          {canRegister ? "Inscribirse" : "Cerrado"}
        </Button>
      ),
    },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      <p className="text-sm text-muted-foreground">Cargando categorías...</p>
    </div>
  );

  // Estado vacío: Tu placeholder funcional personalizado
  if (competitions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-zinc-200 p-12 text-center shadow-sm"
      >
        <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-zinc-300" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900">Listado de Categorías</h3>
        <p className="text-zinc-500 mt-2 max-w-sm mx-auto">
          Estamos terminando de configurar los cupos y precios para las categorías de este torneo.
        </p>
        <Button variant="outline" className="mt-6" disabled>
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
        onClose={() => setSelectedComp(null)}
      />
    </div>
  );
}