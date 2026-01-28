"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { tournamentService, Tournament } from "@/features/tournaments/services/tournament-service";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Info, ArrowLeft, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { motion } from "framer-motion";
import { isBefore, isAfter, parseISO } from "date-fns";
import { CompetitionList } from "@/features/tournaments/components/CompetitionList";

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = React.useState<Tournament | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [canRegister, setCanRegister] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");

  React.useEffect(() => {
    if (tournament) {
      const now = new Date();
      const start = parseISO(tournament.fechaInicio);
      const end = parseISO(tournament.fechaFin);

      if (isBefore(now, start)) {
        setCanRegister(false);
        setStatusMessage("La inscripción aún no ha comenzado");
      } else if (isAfter(now, end)) {
        setCanRegister(false);
        setStatusMessage("El período de inscripción ha finalizado");
      } else {
        setCanRegister(true);
        setStatusMessage("Inscripciones abiertas");
      }
    }
  }, [tournament]);

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
      <div className="container mx-auto px-4 py-20"><TableSkeleton /></div>
    </PageWrapper>
  );

  if (!tournament) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-xl font-medium text-zinc-500">No se encontró el torneo.</p>
      <Link href="/"><Button>Volver al inicio</Button></Link>
    </div>
  );

  return (
    <PageWrapper>
      {/* Header Seccion con fondo sutil */}
      <div className="w-full bg-zinc-50 border-b border-zinc-200">
        <div className="container mx-auto px-4 py-12 md:pb-16">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 group text-zinc-500">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Volver a Torneos
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 transition-none">
                {tournament.estado}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
                {tournament.nombre}
              </h1>
              <div className="flex flex-wrap gap-4 text-zinc-500 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> 
                  Del {format(new Date(tournament.fechaInicio), "d 'de' MMMM", { locale: es })} al {format(new Date(tournament.fechaFin), "d 'de' MMMM", { locale: es })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Presencial / Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Columna Izquierda: Información y Competencias */}
          <div className="lg:col-span-8 space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Info className="h-6 w-6 text-primary" /> Información General
              </h2>
              <div className="prose prose-zinc max-w-none">
                <p className="text-lg text-zinc-600 leading-relaxed">
                  {tournament.descripcion || "Este torneo aún no cuenta con una descripción detallada. Mantente atento a las actualizaciones de los organizadores."}
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" /> Competencias Disponibles
                </h2>
              </div>

              {/* Pasamos el ID y el estado de validación de fechas que ya calculamos */}
                <CompetitionList 
                    tournamentId={id as string} 
                    canRegister={canRegister} 
                />
            </section>
          </div>

          {/* Columna Derecha: Sidebar con Validación */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-xl">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 text-center">
                      Estado del Registro
                    </h3>
                    
                    {/* Indicador de estado visual */}
                    <div className={`text-center p-3 rounded-lg mb-6 text-sm font-semibold ${
                      canRegister ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {statusMessage}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-zinc-500">Apertura</span>
                        <span className="font-semibold">{format(parseISO(tournament.fechaInicio), "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-zinc-500">Cierre</span>
                        <span className="font-semibold">{format(parseISO(tournament.fechaFin), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    disabled={!canRegister}
                    className={`w-full h-14 text-lg font-bold rounded-xl shadow-lg transition-all ${
                      canRegister 
                        ? 'bg-primary shadow-primary/20 hover:scale-[1.02]' 
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    {canRegister ? "Inscribirme ahora" : "Inscripción cerrada"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}