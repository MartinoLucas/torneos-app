"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { tournamentService, Tournament } from "@/features/tournaments/services/tournament-service";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      tournamentService.getById(id as string)
        .then(setTournament)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <PageWrapper>
      <div className="container mx-auto p-8"><TableSkeleton /></div>
    </PageWrapper>
  );

  if (!tournament) return <div>No se encontró el torneo.</div>;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Botón Volver */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                {tournament.estado}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight">{tournament.nombre}</h1>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> Descripción
              </h2>
              <p className="text-zinc-600 leading-relaxed">
                {tournament.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            {/* Aquí iría la lista de competencias más adelante */}
            <div className="bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-12 text-center">
              <Trophy className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="text-zinc-500 font-medium">Competencias Próximamente</h3>
              <p className="text-sm text-zinc-400">Estamos preparando las categorías para este torneo.</p>
            </div>
          </div>

          {/* Sidebar de Detalles */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Información del Evento</h3>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Fecha de Inicio</p>
                  <p className="text-sm font-medium">
                    {format(new Date(tournament.fechaInicio), "PPP", { locale: es })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Fecha de Finalización</p>
                  <p className="text-sm font-medium">
                    {format(new Date(tournament.fechaFin), "PPP", { locale: es })}
                  </p>
                </div>
              </div>

              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 rounded-full py-6 text-lg">
                Inscribirme ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}