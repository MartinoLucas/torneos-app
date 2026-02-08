"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // <--- Faltaba este
import { Plus, Trophy, Calendar } from "lucide-react";

export default function TournamentDetailPage() {
  const params = useParams();
  const id = params.id as string; // Aseguramos que sea string
  const [tournament, setTournament] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(() => {
    // Pasamos el id como string
    tournamentService.getById(id)
      .then(setTournament)
      .finally(() => setLoading(false));
  }, [id]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const compColumns: ColumnDef<any>[] = [
    { id: "nombre", header: "Categoría", cell: (row) => row.nombre },
    { id: "precio", header: "Precio", cell: (row) => `$${row.precio}` },
    { 
      id: "estado", 
      header: "Inscripciones", 
      cell: (row) => row.abierta ? "Abiertas" : "Cerradas" 
    },
  ];

  if (loading) return <div className="p-20 text-center">Cargando...</div>;
  if (!tournament) return <div className="p-20 text-center">No se encontró el torneo.</div>;

  return (
    <PageWrapper>
      <div className="container mx-auto py-10">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">ID: {tournament.id}</Badge>
              <h1 className="text-4xl font-black text-zinc-900">{tournament.nombre}</h1>
              <div className="flex gap-4 mt-4 text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4"/> {tournament.fechaInicio}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4"/> {tournament.competencias?.length || 0} Categorías
                </span>
              </div>
            </div>
            <Button variant="outline">Editar Datos</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Competencias</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Agregar Categoría
            </Button>
          </div>

          <DataTable 
            data={tournament.competencias || []} 
            columns={compColumns} 
          />
        </div>
      </div>
    </PageWrapper>
  );
}