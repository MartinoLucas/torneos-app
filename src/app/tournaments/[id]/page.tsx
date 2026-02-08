"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { tournamentService } from "@/features/tournaments/services/tournament-service";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Info, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { CompetitionList } from "@/features/tournaments/components/CompetitionList";

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [canRegister, setCanRegister] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      tournamentService.getById(id as string)
        .then((data) => {
          setTournament(data);
          const now = new Date();
          const startDate = parseISO(data.fechaInicio);
          
          // Regla: Publicado y antes del inicio
          const isPublished = data.estado === "PUBLICADO";
          const isBeforeStart = isBefore(now, startDate);
          
          setCanRegister(isPublished && isBeforeStart);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center">Cargando...</div>;
  if (!tournament) return <div className="p-20 text-center font-bold">Torneo no disponible.</div>;

  return (
    <PageWrapper>
      <div className="w-full bg-zinc-50 border-b py-12">
        <div className="container mx-auto px-4">
          <Link href="/"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="mr-2 h-4 w-4"/> Volver</Button></Link>
          <div className="space-y-4">
            <Badge className={canRegister ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"}>
              {canRegister ? "Inscripciones Abiertas" : tournament.estado === "FINALIZADO" ? "Torneo Finalizado" : "Inscripciones Cerradas"}
            </Badge>
            <h1 className="text-5xl font-black">{tournament.nombre}</h1>
            <div className="flex gap-4 text-zinc-500">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Inicia: {format(parseISO(tournament.fechaInicio), "PPP", {locale: es})}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-zinc-800"><Info className="text-primary"/> Descripción</h2>
            <p className="text-lg text-zinc-600 leading-relaxed">{tournament.descripcion}</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="text-primary"/> Categorías</h2>
            <CompetitionList tournamentId={id as string} canRegister={canRegister} />
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 p-6 bg-white border rounded-2xl shadow-sm space-y-6">
            <div className={`p-4 rounded-xl flex items-start gap-3 ${canRegister ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">{canRegister ? "¡Estás a tiempo!" : "Atención"}</p>
                <p>{canRegister ? "Puedes inscribirte en cualquier categoría disponible." : "El período de inscripción ha terminado o el torneo no está publicado."}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}